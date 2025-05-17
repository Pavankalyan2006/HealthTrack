
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MoodTracker from "./pages/MoodTracker";
import WaterTracker from "./pages/WaterTracker";
import BreathingExercise from "./pages/BreathingExercise";
import MealLog from "./pages/MealLog";
import SleepTracker from "./pages/SleepTracker";
import FitnessRoutine from "./pages/FitnessRoutine";
import StretchSequence from "./pages/StretchSequence";
import MentalHealthJournal from "./pages/MentalHealthJournal";
import WeightTracker from "./pages/WeightTracker";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { HealthProvider } from "./context/HealthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HealthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mood" element={<MoodTracker />} />
                <Route path="/water" element={<WaterTracker />} />
                <Route path="/breathing" element={<BreathingExercise />} />
                <Route path="/meals" element={<MealLog />} />
                <Route path="/sleep" element={<SleepTracker />} />
                <Route path="/fitness" element={<FitnessRoutine />} />
                <Route path="/stretch" element={<StretchSequence />} />
                <Route path="/journal" element={<MentalHealthJournal />} />
                <Route path="/weight" element={<WeightTracker />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </HealthProvider>
  </QueryClientProvider>
);

export default App;
