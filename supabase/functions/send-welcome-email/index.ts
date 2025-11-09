import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName: string;
  companyName: string;
  companyCode: string;
  employeeId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, companyName, companyCode, employeeId }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Invepin <onboarding@resend.dev>",
      to: [email],
      subject: `Welcome to ${companyName} - Pending Approval`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .code-box {
                background: white;
                border: 2px solid #3b82f6;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
              }
              .code {
                font-size: 32px;
                font-weight: bold;
                color: #3b82f6;
                letter-spacing: 4px;
              }
              .info-box {
                background: white;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                margin: 15px 0;
              }
              .footer {
                text-align: center;
                color: #6b7280;
                font-size: 12px;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">🎯 Registration Submitted!</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName}!</h2>
              
              <p>Thank you for registering with ${companyName}'s Invepin system. Your registration is currently <strong>pending manager approval</strong>.</p>

              <div class="code-box">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Your Company Access Code</p>
                <div class="code">${companyCode}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">Keep this code safe - you'll need it to access the app</p>
              </div>

              <div class="info-box">
                <strong>Your Registration Details:</strong>
                <ul style="margin: 10px 0;">
                  <li><strong>Employee ID:</strong> ${employeeId}</li>
                  <li><strong>Company:</strong> ${companyName}</li>
                  <li><strong>Email:</strong> ${email}</li>
                </ul>
              </div>

              <h3>📋 What happens next?</h3>
              <ol>
                <li>A manager will review your registration</li>
                <li>You'll receive a confirmation email once approved</li>
                <li>After approval, you can log in using your email and password</li>
                <li>Use your company code <strong>${companyCode}</strong> for app access</li>
              </ol>

              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <strong>⏳ Approval Pending</strong><br/>
                Your account access is temporarily limited until a manager approves your registration. This typically takes 24-48 hours.
              </div>

              <p>If you have any questions or if your registration wasn't initiated by you, please contact your company administrator immediately.</p>

              <p style="margin-top: 30px;">Best regards,<br><strong>The Invepin Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Invepin. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
