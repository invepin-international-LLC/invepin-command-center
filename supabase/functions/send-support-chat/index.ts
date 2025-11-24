import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SupportChatRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: SupportChatRequest = await req.json();

    console.log('Sending support chat email from:', email);

    // Send email to support
    const emailResponse = await resend.emails.send({
      from: "Invepin Support <onboarding@resend.dev>",
      to: ["support@invepin.com"],
      replyTo: email,
      subject: `Support Chat from ${name}`,
      html: `
        <h2>New Support Chat Message</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Reply to this email to respond directly to ${email}
        </p>
      `,
    });

    console.log("Support chat email sent successfully:", emailResponse);

    // Send confirmation to user
    await resend.emails.send({
      from: "Invepin Support <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message!",
      html: `
        <h2>Thank you for contacting Invepin Support!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>The Invepin Support Team</p>
        <p style="color: #666; font-size: 12px;">
          Email: support@invepin.com<br>
          Phone: 302-343-5004
        </p>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-support-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
