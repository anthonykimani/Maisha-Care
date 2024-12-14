import Link from "next/link";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa6";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import { Button } from "../ui/button";

export default function WaitlistHeader() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed right-0 top-0 z-[50] m-4">
      <motion.div variants={itemVariants}>
        <Link href="https://github.com/lakshaybhushan/nextjs-notion-waitlist-template/fork">
          <Button
            size="sm"
            variant="secondary"
            className="text-black transition-all duration-150 ease-linear md:hover:text-yellow-200">
            <FaGithub className="md:mr-1.5" />
            <span className="hidden md:inline">Use this template</span>
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}