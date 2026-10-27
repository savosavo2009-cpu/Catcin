exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { BOT_TOKEN, CHAT_ID } = process.env;
  if (!BOT_TOKEN || !CHAT_ID) {
    return { statusCode: 500, body: "Server is not configured" };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Bad JSON" };
  }

  const rating = Number(data.rating);
  const text = String(data.text || "").trim().slice(0, 1000);

  if (!(rating >= 1 && rating <= 4) || !text) {
    return { statusCode: 400, body: "Bad input" };
  }

  const message = `Новый отзыв: ${rating} из 5\n\n${text}`;

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
  });

  return {
    statusCode: res.ok ? 200 : 502,
    body: res.ok ? "ok" : "Telegram error",
  };
};
