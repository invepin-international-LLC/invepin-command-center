import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  storeSize?: string;
  currentSecurity?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, phone, storeSize, currentSecurity, message }: ContactFormRequest = await req.json();

    console.log('Sending contact form from:', email);

    // Send email to support
    const emailResponse = await resend.emails.send({
      from: "Invepin Contact <onboarding@resend.dev>",
      to: ["support@invepin.com"],
      replyTo: email,
      subject: `Contact Form Submission from ${name}${company ? ` - ${company}` : ''}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${storeSize ? `<p><strong>Store Size:</strong> ${storeSize}</p>` : ''}
        ${currentSecurity ? `<p><strong>Current Security:</strong> ${currentSecurity}</p>` : ''}
        ${message ? `
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        ` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">
          Reply to this email to respond directly to ${email}
        </p>
      `,
    });

    console.log("Contact form email sent successfully:", emailResponse);

    // Send confirmation to customer
    await resend.emails.send({
      from: "Invepin Support <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Invepin!",
      html: `
        <h2>Thank you for reaching out to Invepin!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will contact you within 24 hours to schedule your free consultation.</p>
        
        <h3>What Happens Next:</h3>
        <ul>
          <li>A loss prevention expert will reach out to you</li>
          <li>Free security assessment of your current setup</li>
          <li>Custom solution design tailored to your needs</li>
          <li>ROI projection and pricing details</li>
        </ul>

        ${message ? `
          <p><strong>Your Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        ` : ''}

        <hr>
        <p>For immediate assistance, contact us:</p>
        <p>
          <strong>Phone:</strong> 302-343-5004<br>
          <strong>Email:</strong> support@invepin.com
        </p>
        <p>Best regards,<br>The Invepin Team</p>
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
    console.error("Error in send-contact-form function:", error);
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
