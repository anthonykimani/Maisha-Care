"use client";

import { toast } from "sonner";
import { useState } from "react";
import WaitlistHeader from "@/components/waitlist/waitlist-header";
import CTA from "@/components/waitlist/cta";
import WaitlistForm from "@/components/waitlist/waitlist-form";
import WaitlistFooter from "@/components/waitlist/waitlist-footer";
import Particles from "@/components/ui/particles";

const WaitlistContent = () => {
  const [mounted, setMounted] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    const { name, email } = formData;

    if (!name || !email) {
      toast.error("Please fill in all fields 😠");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address 😠");
      return;
    }

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        // Send email
        const mailResponse = await fetch("/api/mail", {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstname: name, email }),
        });

        if (!mailResponse.ok) {
          throw mailResponse.status === 429 
            ? "Rate limited" 
            : "Email sending failed";
        }

        // Insert into Notion
        const notionResponse = await fetch("/api/notion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        });

        if (!notionResponse.ok) {
          throw notionResponse.status === 429 
            ? "Rate limited" 
            : "Notion insertion failed";
        }

        resolve({ name });
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Getting you on the waitlist... 🚀",
      success: () => {
        setFormData({ name: "", email: "" });
        return "Thank you for joining the waitlist 🎉";
      },
      error: (error) => {
        switch(error) {
          case "Rate limited":
            return "You're doing that too much. Please try again later";
          case "Email sending failed":
            return "Failed to send email. Please try again 😢";
          case "Notion insertion failed":
            return "Failed to save your details. Please try again 😢";
          default:
            return "An error occurred. Please try again 😢";
        }
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-12 md:pt-24 bg-[#ff6f91]">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <WaitlistHeader />
        <CTA />
        <WaitlistForm
          name={formData.name}
          email={formData.email}
          handleNameChange={(e) => handleInputChange(e)}
          handleEmailChange={(e) => handleInputChange(e)}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </section>

      <WaitlistFooter />

      <Particles
        quantityDesktop={350}
        quantityMobile={100}
        ease={80}
        color="#F7FF9B"
        refresh
      />
    </main>
  );
};

export default WaitlistContent;