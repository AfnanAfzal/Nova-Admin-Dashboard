import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10"
      >
        <Compass className="h-9 w-9 text-primary" />
      </motion.div>
      <h1 className="font-display text-5xl font-bold tracking-tight">404</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Go back
        </Button>
        <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
      </div>
    </div>
  );
}
