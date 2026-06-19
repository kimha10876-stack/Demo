import { motion } from "framer-motion";
import { Card, CardFooter, CardHeader } from "../../../../components/ui/card";
import { Skeleton } from "../../../../components/ui/skeleton";

const MotionCard = motion(Card);

const MemberCardSkeleton = () => {
  return (
    <MotionCard className="bg-white/85">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-5 w-40 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-6 w-24 rounded-md" />
      </CardHeader>

      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-10 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </CardFooter>
    </MotionCard>
  );
};

export default MemberCardSkeleton;
