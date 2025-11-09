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
                <li><strong>Review and sign the facial recognition consent</strong> (REQUIRED)</li>
                <li>Complete your profile setup</li>
                <li>Start tracking inventory and accessing your assigned features</li>
              </ol>

              <!-- Facial Recognition Consent Notice -->
              <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 25px; margin: 30px 0;">
                <h3 style="color: #856404; margin-top: 0;">⚠️ MANDATORY: Facial Recognition Consent Required</h3>
                <p style="color: #856404; font-weight: bold; margin: 10px 0;">
                  Before accessing facial recognition features, you MUST review and sign the consent agreement.
                </p>
                
                <p style="color: #333; font-weight: bold; margin: 15px 0 10px 0;">Facial Recognition Technology Notice:</p>
                <ul style="color: #333; line-height: 1.8; margin: 0; padding-left: 25px;">
                  <li><strong>Data Collection:</strong> Your facial biometric data will be captured, processed, and stored</li>
                  <li><strong>Purpose:</strong> Employee authentication, time tracking, and security monitoring</li>
                  <li><strong>Storage:</strong> All data is encrypted using industry-standard security protocols</li>
                  <li><strong>Access:</strong> Limited to authorized personnel only - never sold or shared with third parties</li>
                  <li><strong>Retention:</strong> Data retained during employment; deletion available upon request after termination</li>
                  <li><strong>Your Rights:</strong> Access, correct, or request deletion at any time</li>
                </ul>
                
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
                  <p style="color: #721c24; font-weight: bold; margin: 0 0 10px 0;">🚨 CRITICAL WARNING - Responsible Use Required:</p>
                  <ul style="color: #721c24; line-height: 1.8; margin: 0; padding-left: 25px;">
                    <li>Do NOT share access credentials with others</li>
                    <li>Do NOT attempt to bypass, manipulate, or interfere with the system</li>
                    <li>Do NOT use another person's biometric data or allow others to use yours</li>
                    <li>Do NOT engage in any form of system misuse or data manipulation</li>
                    <li>REPORT any suspicious activity, system errors, or security concerns immediately</li>
                  </ul>
                  <p style="color: #721c24; margin: 15px 0 0 0; font-weight: bold;">
                    ⚠️ CONSEQUENCES: Misuse may result in immediate termination, legal action, and potential criminal liability.
                  </p>
                </div>
                
                <div style="background: white; border: 1px solid #d1d5db; border-radius: 5px; padding: 15px; margin: 20px 0;">
                  <p style="color: #333; margin: 0; line-height: 1.6;">
                    <strong>System Limitations:</strong> No facial recognition system is 100% accurate. False positives or negatives 
                    may occasionally occur. Report any errors to management. Alternative authentication methods are available if needed.
                  </p>
                </div>
                
                <p style="color: #333; margin: 15px 0; line-height: 1.6;">
                  <strong>Privacy Rights:</strong> You have the right to access, correct, or request deletion of your biometric data. 
                  Contact <a href="mailto:privacy@invepin.com" style="color: #3b82f6;">privacy@invepin.com</a> for data privacy requests 
                  or to exercise your rights.
                </p>
                
                <p style="color: #856404; font-weight: bold; margin: 20px 0 0 0; padding: 15px; background: #fef3c7; border-radius: 5px;">
                  📝 Upon first login, you will be prompted to review the complete consent agreement and provide your formal signature. 
                  This consent is REQUIRED to access facial recognition features and cannot be bypassed.
                </p>
              </div>

              <div style="text-align: center;">
                <a href="${Deno.env.get('SUPABASE_URL') || 'https://your-app-url.com'}" class="button">
                  Access Invepin Now →
                </a>
              </div>

              <p style="margin-top: 30px;">If you have any questions about using the system, please reach out to your manager or administrator.</p>
              
              <p style="font-size: 12px; color: #6b7280; margin-top: 25px;">
                For complete privacy policy and consent agreement details, contact 
                <a href="mailto:privacy@invepin.com" style="color: #3b82f6;">privacy@invepin.com</a>
              </p>

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
