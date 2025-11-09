import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApprovalEmailRequest {
  email: string;
  fullName: string;
  approved: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, approved }: ApprovalEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Invepin <onboarding@resend.dev>",
      to: [email],
      subject: approved ? "✅ Registration Approved - Welcome!" : "❌ Registration Not Approved",
      html: approved ? `
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
                background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
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
              .success-box {
                background: #d1fae5;
                border-left: 4px solid #10b981;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 20px 0;
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
              <h1 style="margin: 0;">🎉 You're Approved!</h1>
            </div>
            <div class="content">
              <h2>Congratulations ${fullName}!</h2>
              
              <div class="success-box">
                <strong>✅ Your registration has been approved!</strong><br/>
                You now have full access to the Invepin system.
              </div>

              <p>Your manager has reviewed and approved your employee registration. You can now log in and start using all features of the system.</p>

              <h3>🚀 Getting Started:</h3>
              <ol>
                <li>Visit the Invepin app</li>
                <li>Log in with your email and password</li>
                <li>Complete your profile setup</li>
                <li>Start tracking inventory and accessing your assigned features</li>
              </ol>

              <div style="text-align: center;">
                <a href="${Deno.env.get('SUPABASE_URL') || 'https://your-app-url.com'}" class="button">
                  Access Invepin Now →
                </a>
              </div>

              <p style="margin-top: 30px;">If you have any questions about using the system, please reach out to your manager or administrator.</p>

              <p>Best regards,<br><strong>The Invepin Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Invepin. All rights reserved.</p>
            </div>
          </body>
        </html>
      ` : `
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
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
              .warning-box {
                background: #fee2e2;
                border-left: 4px solid #ef4444;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
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
              <h1 style="margin: 0;">Registration Status Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName},</h2>
              
              <div class="warning-box">
                <strong>Your registration was not approved</strong><br/>
                After reviewing your application, we're unable to approve your access at this time.
              </div>

              <p>If you believe this is an error or if you have questions about this decision, please contact your company administrator or HR department.</p>

              <h3>📞 Need Help?</h3>
              <p>If you have questions or concerns, please reach out to your organization's administrator directly.</p>

              <p style="margin-top: 30px;">Best regards,<br><strong>The Invepin Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Invepin. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Approval email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
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
