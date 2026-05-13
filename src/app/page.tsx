"use client";

import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import CurrentExperience from "@/components/home/CurrentExperience";
import RecommendationsCarousel from "@/components/home/RecommendationsCarousel";
import AboutMe from "@/components/home/AboutMe";

export default function Home() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <HeroSection />
        <BentoGrid />
        <CurrentExperience />
        <RecommendationsCarousel />
        <AboutMe />
      </motion.div>
    </AnimatePresence>
  );
}
