// src/app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server";

interface SubscribeRequestBody {
  email: string;
}

/**
 * API route handler for newsletter subscription
 * This demonstrates a secure pattern for handling form submissions
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body: SubscribeRequestBody = await request.json();

    // Validate email
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // This is where you would integrate with your email service provider
    // Examples: Mailchimp, SendGrid, ConvertKit, etc.
    try {
      // For demonstration purposes only - replace with actual API call
      // const response = await fetch('https://your-email-service-api.com/subscribe', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.EMAIL_SERVICE_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     email,
      //     listId: process.env.EMAIL_LIST_ID
      //   })
      // });

      // if (!response.ok) {
      //   throw new Error('Subscription service error');
      // }

      // Log subscription for demo purposes
      console.log(`Newsletter subscription: ${email}`);

      // Return success response
      return NextResponse.json(
        {
          success: true,
          message: "Successfully subscribed to newsletter",
        },
        { status: 200 }
      );
    } catch (serviceError) {
      console.error("Newsletter service error:", serviceError);
      return NextResponse.json(
        { success: false, message: "Error subscribing to newsletter" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
