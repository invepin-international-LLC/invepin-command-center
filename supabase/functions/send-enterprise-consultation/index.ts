import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnterpriseConsultationRequest {
  name: string;
  email: string;
  company: string;
  phone?: string;
  numLocations?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, phone, numLocations, message }: EnterpriseConsultationRequest = await req.json();

    console.log('Sending enterprise consultation request from:', email);

    // Send email to support
    const emailResponse = await resend.emails.send({
      from: "Invepin Enterprise <onboarding@resend.dev>",
      to: ["support@invepin.com"],
      replyTo: email,
      subject: `Enterprise Consultation Request from ${company}`,
      html: `
        <h2>New Enterprise Consultation Request</h2>
        <p><strong>Contact Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${numLocations ? `<p><strong>Number of Locations:</strong> ${numLocations}</p>` : ''}
        ${message ? `
          <p><strong>Additional Information:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        ` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">
          Reply to this email to respond directly to ${email}
        </p>
      `,
    });

    console.log("Enterprise consultation email sent successfully:", emailResponse);

    // Send confirmation to customer
    await resend.emails.send({
      from: "Invepin Enterprise <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for your enterprise consultation request",
      html: `
        <h2>Thank you for contacting Invepin Enterprise!</h2>
        <p>Hi ${name},</p>
        <p>We have received your enterprise consultation request for <strong>${company}</strong> and will get back to you within 24 hours to schedule a comprehensive consultation.</p>
        
        <h3>What to Expect Next:</h3>
        <ul>
          <li>A dedicated enterprise account manager will contact you</li>
          <li>We'll discuss your multi-location security needs in detail</li>
          <li>Custom solution design tailored to your enterprise</li>
          <li>ROI analysis and pricing options</li>
        </ul>

        <p><strong>Your Request Details:</strong></p>
        <ul>
          <li>Company: ${company}</li>
          ${numLocations ? `<li>Number of Locations: ${numLocations}</li>` : ''}
          ${phone ? `<li>Phone: ${phone}</li>` : ''}
        </ul>

        <hr>
        <p>For immediate assistance, contact us:</p>
        <p>
          <strong>Phone:</strong> 302-343-5004<br>
          <strong>Email:</strong> support@invepin.com
        </p>
        <p>Best regards,<br>The Invepin Enterprise Team</p>
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
    console.error("Error in send-enterprise-consultation function:", error);
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
