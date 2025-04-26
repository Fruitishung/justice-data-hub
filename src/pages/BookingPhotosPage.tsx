
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingPhotoGenerator } from "@/components/booking/BookingPhotoGenerator";

const BookingPhotosPage = () => {
  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Booking Photos Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage AI booking photos for testing
          </p>
        </div>

        <BookingPhotoGenerator />
      </div>
    </div>
  );
};

export default BookingPhotosPage;
