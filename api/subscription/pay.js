const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");

module.exports = async function handler(req, res) {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  );

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    console.log("📝 Payment request received:", {
      userId: req.body.userId?.substring(0, 8),
      storyId: req.body.storyId?.substring(0, 8),
      paymentMethod: req.body.paymentMethod,
    });

    const {
      userId,
      storyId,
      paymentMethod = "mobile",
      customer,
      mobileNetwork,
    } = req.body;

    if (!userId || !customer) {
      console.error("❌ Missing required fields:", {
        userId: !!userId,
        customer: !!customer,
      });
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    let amount = 2000;
    let storyTitle = "KISA Story";

    // If purchasing a specific story, fetch the story price and title
    if (storyId) {
      console.log("🔍 Fetching story:", storyId);
      const { data: story, error: storyError } = await supabaseAdmin
        .from("stories")
        .select("id, title, price")
        .eq("id", storyId)
        .single();

      if (storyError || !story) {
        console.error("❌ Story not found:", storyError);
        return res
          .status(404)
          .json({ success: false, error: "Story not found" });
      }

      amount = story.price || 1000;
      storyTitle = story.title;
      console.log("✅ Story found:", { title: storyTitle, amount });
    }

    const reference = storyId
      ? `KSP-${storyId.slice(0, 4)}-${userId.slice(0, 4)}-${Date.now()}`
      : `KSB-${userId.slice(0, 8)}-${Date.now()}`;

    console.log("📝 Creating transaction with reference:", reference);

    // ✅ Split full name into first and last name properly
    const fullName = (
      customer.fullName ||
      customer.firstname ||
      "Msomaji"
    ).trim();
    const nameParts = fullName.split(" ");
    const firstname = nameParts[0] || "Msomaji";
    const lastname = nameParts.slice(1).join(" ") || "KISA";

    const customerName = `${firstname} ${lastname}`.trim();

    // Insert transaction
    const { data: transaction, error: txError } = await supabaseAdmin
      .from("subscription_transactions")
      .insert({
        user_id: userId,
        story_id: storyId || null,
        amount,
        payment_method: paymentMethod,
        status: "pending",
        reference,
        customer_name: customerName,
        customer_phone: customer.phone_number || customer.phone,
        customer_email: customer.email,
      })
      .select()
      .single();

    if (txError) {
      console.error("❌ Transaction insert error:", txError);
      return res
        .status(500)
        .json({
          success: false,
          error: "Failed to create transaction",
          details: txError.message,
        });
    }

    console.log("✅ Transaction created:", transaction.id);

    // Format phone number
    let rawPhone = customer.phone_number || customer.phone || "";
    let phoneNumber = String(rawPhone).replace(/^\+/, "").replace(/\D/g, "");
    if (phoneNumber.startsWith("0"))
      phoneNumber = "255" + phoneNumber.substring(1);
    console.log("📱 Formatted phone:", phoneNumber);

    // ✅ Ensure phone number is valid
    if (phoneNumber.length < 10) {
      console.error("❌ Invalid phone number:", phoneNumber);
      return res.status(400).json({
        success: false,
        error:
          "Invalid phone number format. Please use a valid Tanzanian number.",
      });
    }

    let paymentUrl = null;
    const snippeKey = process.env.SNIPPE_API_KEY;

    console.log("🔑 Snippe Key present:", !!snippeKey);
    console.log(
      "🔑 Snippe Key first 10 chars:",
      snippeKey?.substring(0, 10) + "...",
    );

    if (!snippeKey) {
      console.error("❌ SNIPPE_API_KEY is not set!");
      return res.status(500).json({
        success: false,
        error: "Payment provider not configured. Please contact support.",
      });
    }

    // ✅ Snippe API Integration
    let webhookUrl =
      process.env.SNIPPE_WEBHOOK_URL ||
      "https://kisa.co.tz/api/webhooks/snippe";
    if (webhookUrl.includes("localhost")) {
      webhookUrl = "https://kisa.co.tz/api/webhooks/snippe";
    }

    // ✅ Build Snippe payload with all required fields
    const snippePayload = {
      payment_type: paymentMethod,
      webhook_url: webhookUrl,
      external_reference: reference,
      phone_number: phoneNumber,
      details: {
        amount,
        currency: "TZS",
        description: `Malipo ya hadithi: ${storyTitle}`,
      },
      customer: {
        firstname: firstname,
        lastname: lastname,
        email: (customer.email || "reader@kisa.co.tz").trim(),
      },
      metadata: {
        type: storyId ? "story_purchase" : "kisa_subscription",
        story_id: storyId || null,
        story_title: storyTitle,
        user_id: userId,
        reference,
        transaction_id: transaction.id,
        amount,
        mobile_network: mobileNetwork || null,
      },
    };

    console.log("📤 Sending to Snippe:", {
      amount,
      phone: phoneNumber,
      customer: snippePayload.customer,
      webhook: webhookUrl,
      reference: reference,
    });

    try {
      const baseUrl =
        process.env.SNIPPE_API_BASE_URL || "https://api.snippe.sh";
      console.log("📤 Snippe API URL:", `${baseUrl}/api/v1/payments`);

      const snippeResponse = await axios.post(
        `${baseUrl}/api/v1/payments`,
        snippePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${snippeKey}`,
            "Idempotency-Key": `pay-${reference}`,
          },
          timeout: 30000,
        },
      );

      console.log("✅ Snippe Response Status:", snippeResponse.status);
      console.log(
        "✅ Snippe Response Data:",
        JSON.stringify(snippeResponse.data, null, 2),
      );

      paymentUrl = snippeResponse.data?.data?.checkout_url || null;
      console.log("🔗 Payment URL:", paymentUrl);

      const snippeReference = snippeResponse.data?.data?.reference || null;
      if (snippeReference) {
        console.log("📝 Snippe Reference:", snippeReference);
        await supabaseAdmin
          .from("subscription_transactions")
          .update({ snippe_reference: snippeReference })
          .eq("id", transaction.id);
      }
    } catch (snippeError) {
      console.error("❌ Snippe API Error Details:");
      console.error("  Message:", snippeError.message);
      console.error("  Response Status:", snippeError.response?.status);
      console.error(
        "  Response Data:",
        JSON.stringify(snippeError.response?.data, null, 2),
      );
      console.error("  Request Data:", JSON.stringify(snippePayload, null, 2));

      // ✅ Return Snippe error to frontend with details
      return res.status(400).json({
        success: false,
        error: snippeError.response?.data?.message || "Payment provider error",
        details: snippeError.response?.data || null,
        reference: reference,
      });
    }

    if (paymentUrl) {
      await supabaseAdmin
        .from("subscription_transactions")
        .update({ payment_url: paymentUrl })
        .eq("id", transaction.id);
    }

    console.log("✅ Payment initiated successfully");
    return res.json({
      success: true,
      reference,
      transaction_id: transaction.id,
      payment_url: paymentUrl,
      amount,
      story_title: storyTitle,
      message:
        paymentMethod === "mobile"
          ? `Ombi la malipo ya TZS ${amount.toLocaleString()} limetumwa kwenye simu yako`
          : "Elekezwa kwenye ukurasa wa malipo",
    });
  } catch (error) {
    console.error("❌ Payment error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
    });
    return res.status(500).json({
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Payment initiation failed",
      details: error.response?.data || null,
    });
  }
};
