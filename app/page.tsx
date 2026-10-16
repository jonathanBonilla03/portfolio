import { Hero } from "@/components/home/Hero";
import { About, Contact, Education, Experience, SelectedWork, Skills } from "@/components/home/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Contact />
    </>
  );
}
