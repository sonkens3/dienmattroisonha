"use client";

import { Bot, ImagePlus, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { formatRange, formatVnd } from "@/lib/format";
import { saveLeadToStorage, submitLeadRecord, type LeadFileInput, type LeadRecord } from "@/lib/leads";
import { estimateSolarSystem, type SolarInput } from "@/lib/solarCalculator";

type ChatStep = "projectType" | "bill" | "phase" | "dayUsage" | "roofArea" | "storage" | "done";
type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
};

const initialMessage =
  "Xin chào anh/chị, em là trợ lý tư vấn điện mặt trời. Anh/chị đang muốn lắp cho loại công trình nào?";

export function ChatbotWidget() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const messageIdRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>("projectType");
  const [inputText, setInputText] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);
  const [imagePhonePrompted, setImagePhonePrompted] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [answers, setAnswers] = useState<Partial<SolarInput>>({
    dayUsageLevel: "medium",
    phase: "unknown",
  });
  const [messages, setMessages] = useState<Message[]>([
    { id: "start", role: "bot", text: initialMessage },
  ]);

  const quickReplies = useMemo(() => getQuickReplies(step), [step]);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      const messageList = messageListRef.current;

      if (!messageList) return;

      messageList.scrollTo({
        top: messageList.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, open, quickReplies.length, selectedImages.length, isSubmittingLead]);

  function createMessage(role: Message["role"], text: string): Message {
    messageIdRef.current += 1;

    return {
      id: `chat-message-${messageIdRef.current}`,
      role,
      text,
    };
  }

  function append(role: Message["role"], text: string) {
    setMessages((current) => [...current, createMessage(role, text)]);
  }

  function progress(label: string, patch: Partial<SolarInput>) {
    append("user", label);
    const nextAnswers = { ...answers, ...patch };
    setAnswers(nextAnswers);

    if (step === "projectType") {
      setStep("bill");
      append("bot", "Tiền điện trung bình mỗi tháng của anh/chị khoảng bao nhiêu?");
      return;
    }

    if (step === "bill") {
      setStep("phase");
      append("bot", "Công trình đang dùng điện 1 pha hay 3 pha?");
      return;
    }

    if (step === "phase") {
      setStep("dayUsage");
      append("bot", "Ban ngày công trình dùng điện ở mức nào?");
      return;
    }

    if (step === "dayUsage") {
      setStep("roofArea");
      append("bot", "Diện tích mái có thể lắp pin khoảng bao nhiêu m²?");
      return;
    }

    if (step === "roofArea") {
      setStep("storage");
      append("bot", "Anh/chị có muốn dùng pin lưu trữ hoặc cần điện dự phòng khi mất điện không?");
      return;
    }

    if (step === "storage") {
      setStep("done");
      append("bot", buildResultMessage(nextAnswers));
    }
  }

  function handleQuickReply(label: string) {
    if (step === "projectType") {
      progress(label, { projectType: label });
      return;
    }

    if (step === "bill") {
      const billMap: Record<string, number> = {
        "1-2 triệu": 1_500_000,
        "2-4 triệu": 3_000_000,
        "4-7 triệu": 5_500_000,
        "7-12 triệu": 9_500_000,
        "Trên 12 triệu": 14_000_000,
      };
      if (label === "Nhập số khác") {
        append("bot", "Anh/chị nhập số tiền điện, ví dụ: 5 triệu hoặc 5000000.");
        return;
      }
      progress(label, { monthlyBill: billMap[label] ?? 4_000_000 });
      return;
    }

    if (step === "phase") {
      const phase = label === "3 pha" ? "3phase" : label === "1 pha" ? "1phase" : "unknown";
      progress(label, { phase });
      return;
    }

    if (step === "dayUsage") {
      const dayUsageLevel = label === "Ít" ? "low" : label === "Nhiều" ? "high" : "medium";
      progress(label, { dayUsageLevel });
      return;
    }

    if (step === "roofArea") {
      if (label === "Nhập số khác") {
        append("bot", "Anh/chị nhập diện tích mái ước tính, ví dụ: 80m2.");
        return;
      }
      progress(label, { roofArea: parseRoofArea(label) });
      return;
    }

    if (step === "storage") {
      progress(label, { wantStorage: label !== "Chưa cần" });
    }
  }

  async function submitText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = inputText.trim();
    const phone = extractVietnamesePhone(text);

    if (!text && !selectedImages.length) return;
    setInputText("");

    if (phone) {
      await sendLeadFromChat({
        phone,
        text: text || `Khách gửi số điện thoại/Zalo ${phone}`,
        files: selectedImages,
        successMessage: buildPhoneThanksMessage(phone, selectedImages.length > 0),
      });
      setSubmittedPhone(phone);
      setImagePhonePrompted(false);
      setStep("done");
      return;
    }

    if (selectedImages.length && !submittedPhone) {
      if (text || !imagePhonePrompted) {
        append("user", [text, buildImageListMessage(selectedImages)].filter(Boolean).join("\n"));
      }
      if (text || !imagePhonePrompted) {
        append("bot", buildImagePhonePromptMessage());
      }
      setImagePhonePrompted(true);
      return;
    }

    if (selectedImages.length && submittedPhone) {
      await sendLeadFromChat({
        phone: submittedPhone,
        text: text || "Khách gửi bổ sung ảnh hóa đơn điện hoặc ảnh mái.",
        files: selectedImages,
        successMessage:
          "Em đã gửi ảnh bổ sung đến kỹ thuật. Kỹ thuật sẽ xem hóa đơn/ảnh mái và liên hệ tư vấn trực tiếp.",
      });
      return;
    }

    if (step === "bill") {
      progress(text, { monthlyBill: parseMoney(text) });
      return;
    }

    if (step === "roofArea") {
      progress(text, { roofArea: parseRoofArea(text) });
      return;
    }

    if (step === "done") {
      append("user", text);
      append(
        "bot",
        "Anh/chị có thể để lại số điện thoại/Zalo hoặc bấm biểu tượng ảnh để gửi hóa đơn điện/ảnh mái, kỹ thuật sẽ tính phương án chính xác hơn.",
      );
      return;
    }

    append("user", text);
    append("bot", "Anh/chị chọn nhanh một phương án bên dưới để em tính tiếp nhé.");
  }

  async function sendLeadFromChat({
    phone,
    text,
    files,
    successMessage,
  }: {
    phone: string;
    text: string;
    files: File[];
    successMessage: string;
  }) {
    const fileMessage = files.length ? `Ảnh đính kèm: ${files.map((file) => file.name).join(", ")}` : "";
    const userMessageText = [text, fileMessage].filter(Boolean).join("\n");
    const userMessage = createMessage("user", userMessageText || "Gửi thông tin tư vấn");
    const transcript = [...messages, userMessage];

    setMessages((current) => [...current, userMessage]);
    setIsSubmittingLead(true);

    const lead = saveChatLead(phone, answers, transcript, text || fileMessage, files);
    const delivery = await submitLeadRecordToServer(lead, files);
    setIsSubmittingLead(false);

    if (delivery?.ok) {
      setSelectedImages([]);
      setImagePhonePrompted(false);
      append("bot", successMessage);
      return;
    }

    if (delivery?.configured === false) {
      setSelectedImages([]);
      setImagePhonePrompted(false);
      append(
        "bot",
        `Cảm ơn anh/chị đã để lại số ${phone}. Em đã lưu thông tin tạm thời, nhưng hệ thống chưa cấu hình Google Sheet/Telegram để gửi thật.`,
      );
      return;
    }

    append(
      "bot",
      `Cảm ơn anh/chị đã để lại số ${phone}. Em đã lưu thông tin tạm thời, nhưng gửi Google Sheet/Telegram đang lỗi. Anh/chị có thể gửi lại hoặc kỹ thuật kiểm tra trong admin mock.`,
    );
  }

  function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length) {
      setSelectedImages((current) => [...current, ...files].slice(0, 6));
      if (!submittedPhone && !imagePhonePrompted) {
        append("bot", buildImagePhonePromptMessage());
        setImagePhonePrompted(true);
      }
    }

    event.currentTarget.value = "";
  }

  function removeSelectedImage(index: number) {
    setSelectedImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <>
      <button
        type="button"
        className="support-cta fixed bottom-[5.75rem] right-3 z-40 isolate flex min-h-16 items-center gap-3 overflow-visible rounded-full bg-teal-700 py-3 pl-3 pr-5 text-white shadow-2xl ring-4 ring-teal-200/80 transition hover:bg-teal-800 sm:bottom-6 sm:right-6"
        aria-label="Mở chat tư vấn"
        title="Chat tư vấn"
        onClick={() => setOpen(true)}
      >
        <span className="support-ripple" aria-hidden />
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-teal-700 shadow-sm">
          <MessageCircle size={28} aria-hidden />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[11px] font-black uppercase tracking-wide text-amber-200">
            Hỗ trợ
          </span>
          <span className="block text-base font-black">Tư vấn ngay</span>
        </span>
      </button>

      {open ? (
        <section className="fixed bottom-[5.25rem] left-3 right-3 z-50 flex h-[calc(100dvh-7rem)] max-h-[620px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:bottom-6 sm:left-auto sm:right-5 sm:h-[min(620px,calc(100dvh-3rem))] sm:w-[390px] sm:max-w-sm">
          <div className="flex items-center justify-between gap-3 bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} aria-hidden />
              <p className="font-bold">Tư vấn điện mặt trời</p>
            </div>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/10"
              aria-label="Đóng chat"
              onClick={() => setOpen(false)}
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <div
            ref={messageListRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 scroll-smooth"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] whitespace-pre-line rounded-lg px-3 py-2 text-sm leading-6 ${
                  message.role === "bot"
                    ? "bg-white text-slate-700 shadow-sm"
                    : "ml-auto bg-teal-700 text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isSubmittingLead ? (
              <div className="max-w-[78%] rounded-lg bg-white px-3 py-2 text-sm leading-6 text-slate-500 shadow-sm">
                Đang chuyển thông tin đến kỹ thuật...
              </div>
            ) : null}
          </div>

          {quickReplies.length ? (
            <div className="flex gap-2 overflow-x-auto border-t border-slate-200 bg-white p-3">
              {quickReplies.map((reply) => (
                <button
                  type="button"
                  key={reply}
                  className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:border-teal-700 hover:text-teal-800"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          ) : null}

          <div className="border-t border-slate-200 bg-white px-3 pt-3">
            <p className="text-xs leading-5 text-slate-500">
              Bấm nút ảnh để gửi hóa đơn điện hoặc ảnh mái cho kỹ thuật.
            </p>
            {selectedImages.length ? (
              <div className="mt-2 flex max-h-16 flex-wrap gap-2 overflow-y-auto pr-1">
                {selectedImages.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="inline-flex max-w-full items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-900"
                  >
                    <span className="max-w-[170px] truncate">{file.name}</span>
                    <button
                      type="button"
                      className="grid h-5 w-5 place-items-center rounded hover:bg-teal-100"
                      aria-label={`Bỏ ảnh ${file.name}`}
                      onClick={() => removeSelectedImage(index)}
                    >
                      <X size={13} aria-hidden />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <form className="flex gap-2 bg-white p-3" onSubmit={submitText}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleImageSelect}
            />
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-slate-300 text-teal-800 hover:border-teal-700 hover:bg-teal-50"
              aria-label="Chọn ảnh hóa đơn điện hoặc ảnh mái"
              title="Gửi ảnh hóa đơn/ảnh mái"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={18} aria-hidden />
            </button>
            <input
              className="field h-10 py-2 text-sm"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button
              type="submit"
              disabled={isSubmittingLead}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-700 text-white hover:bg-teal-800 disabled:bg-slate-400"
              aria-label="Gửi"
            >
              <Send size={17} aria-hidden />
            </button>
          </form>
        </section>
      ) : null}
    </>
  );
}

function getQuickReplies(step: ChatStep) {
  if (step === "projectType") return ["Nhà ở", "Nhà nghỉ", "Quán cafe", "Xưởng", "Văn phòng", "Khác"];
  if (step === "bill") return ["1-2 triệu", "2-4 triệu", "4-7 triệu", "7-12 triệu", "Trên 12 triệu", "Nhập số khác"];
  if (step === "phase") return ["1 pha", "3 pha", "Không rõ"];
  if (step === "dayUsage") return ["Ít", "Trung bình", "Nhiều"];
  if (step === "roofArea") return ["30m²", "60m²", "90m²", "120m²", "Nhập số khác"];
  if (step === "storage") return ["Chưa cần", "Có lưu trữ", "Cần backup"];
  return [];
}

function buildImageListMessage(files: File[]) {
  return files.length ? `Ảnh khách gửi: ${files.map((file) => file.name).join(", ")}` : "";
}

function buildImagePhonePromptMessage() {
  return "Em đã nhận ảnh anh/chị gửi. Anh/chị để lại thêm số điện thoại/Zalo, em sẽ chuyển ảnh và thông tin đến kỹ thuật để liên hệ lại sớm nhất và tư vấn trực tiếp.";
}

function buildPhoneThanksMessage(phone: string, hasImages: boolean) {
  const leadInfo = hasImages ? "số điện thoại/Zalo, ảnh và nội dung trao đổi" : "số điện thoại/Zalo và nội dung trao đổi";

  return `Cảm ơn anh/chị đã để lại số ${phone}. Em đã ghi nhận và chuyển ${leadInfo} đến kỹ thuật. Kỹ thuật sẽ liên hệ lại sớm nhất để tư vấn trực tiếp cho anh/chị.`;
}

function buildResultMessage(input: Partial<SolarInput>) {
  const estimate = estimateSolarSystem({
    monthlyBill: input.monthlyBill ?? 4_000_000,
    averageElectricPrice: 3000,
    projectType: input.projectType,
    phase: input.phase ?? "unknown",
    dayUsageLevel: input.dayUsageLevel ?? "medium",
    roofArea: input.roofArea,
    wantStorage: input.wantStorage,
  });

  return `Dựa trên thông tin anh/chị cung cấp, em đề xuất khảo sát hệ khoảng ${formatRange(
    estimate.recommendedKwMin,
    estimate.recommendedKwMax,
    "kW",
  )}. Cần khoảng ${estimate.panelCountMin}-${estimate.panelCountMax} tấm pin, mái ${estimate.roofAreaMin}-${estimate.roofAreaMax}m², chi phí ${formatVnd(
    estimate.investmentMin,
  )}-${formatVnd(estimate.investmentMax)}, dự kiến giảm khoảng ${estimate.billReductionMin}-${estimate.billReductionMax}% tiền điện mỗi tháng, thời gian hoàn vốn tốt nhất từ khoảng ${estimate.paybackMin} năm. Anh/chị có thể để lại số điện thoại/Zalo và bấm nút ảnh bên dưới để gửi hóa đơn điện hoặc ảnh mái, kỹ thuật sẽ tính chính xác hơn.`;
}

function parseMoney(text: string) {
  const normalized = text.toLowerCase().replace(",", ".");
  const match = normalized.match(/\d+(\.\d+)?/);
  if (!match) return 4_000_000;
  const value = Number(match[0]);
  if (normalized.includes("tr")) return value * 1_000_000;
  if (value < 1000) return value * 1_000_000;
  return value;
}

function parseRoofArea(text: string) {
  const match = text.replace(",", ".").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 60;
}

function extractVietnamesePhone(text: string) {
  const normalized = text.replace(/[\s.\-()]/g, "");
  const match = normalized.match(/(?:\+?84|0)(?:3|5|7|8|9)\d{8}/);

  if (!match) return null;

  const rawPhone = match[0];
  if (rawPhone.startsWith("+84")) return `0${rawPhone.slice(3)}`;
  if (rawPhone.startsWith("84")) return `0${rawPhone.slice(2)}`;
  return rawPhone;
}

function saveChatLead(
  phone: string,
  answers: Partial<SolarInput>,
  messages: Message[],
  latestText: string,
  files: File[],
): LeadRecord {
  const lead: LeadRecord = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: "Khách từ chatbot",
    phone,
    city: "",
    projectType: answers.projectType ?? "Chưa rõ",
    monthlyBill: answers.monthlyBill
      ? `${new Intl.NumberFormat("vi-VN").format(answers.monthlyBill)} đ/tháng`
      : "Chưa rõ",
    phase: formatPhase(answers.phase),
    roofArea: answers.roofArea ? `${answers.roofArea}m²` : "Chưa rõ",
    need: answers.wantStorage ? "Có nhu cầu lưu trữ/backup" : "Tư vấn từ chatbot",
    billImageName: files.map((file) => file.name).join(", "),
    roofImageName: "",
    note: [
      "Khách để lại số điện thoại qua chatbot.",
      files.length ? `Ảnh khách gửi: ${files.map((file) => file.name).join(", ")}` : "",
      `Tin nhắn mới nhất: ${latestText}`,
      `Nội dung trao đổi: ${messages
        .map((message) => `${message.role === "bot" ? "Bot" : "Khách"}: ${message.text}`)
        .join(" | ")}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  saveLeadToStorage(lead);
  return lead;
}

async function submitLeadRecordToServer(lead: LeadRecord, files: File[]) {
  try {
    const leadFiles: LeadFileInput[] = files.map((file, index) => ({
      field: "chatImage",
      label: `Ảnh khách gửi qua chat ${index + 1}`,
      file,
    }));

    return submitLeadRecord(lead, {
      source: "Chatbot",
      pageUrl: window.location.href,
      files: leadFiles,
    });
  } catch {
    return null;
  }
}

function formatPhase(phase: SolarInput["phase"]) {
  if (phase === "1phase") return "1 pha";
  if (phase === "3phase") return "3 pha";
  return "Không rõ";
}
