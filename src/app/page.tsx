"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/authStore";
import { useUserPets } from "@/hooks/pets/usePets";
import {
  useAllPetsMatches,
  useAllPetsPendingMatches,
} from "@/hooks/matches/useMatches";
import { PetDto, PetPurpose } from "@/lib/types/pet";

// Components
import Link from "next/link";
import { PetGallery } from "@/components/pets/detail/PetGallery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  ArrowRight,
  Plus,
  Heart,
  PawPrint,
  Clock,
  Mail,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MatchDto, MatchStatus } from "@/lib/types/match";

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: "blue" | "purple" | "amber";
  stat?: number;
}

function QuickAction({
  title,
  description,
  href,
  icon: Icon,
  color,
  stat,
}: QuickActionProps) {
  return (
    <Link href={href} className="h-full">
      <Card className="group relative h-full bg-white/5 hover:bg-white/[0.07] border-white/10 transition-all duration-300">
        <div className="p-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "p-3 rounded-xl",
                  color === "blue" && "bg-blue-500/20",
                  color === "purple" && "bg-purple-500/20",
                  color === "amber" && "bg-amber-500/20"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    color === "blue" && "text-blue-400",
                    color === "purple" && "text-purple-400",
                    color === "amber" && "text-amber-400"
                  )}
                />
              </div>
              {stat !== undefined && stat > 0 && (
                <Badge
                  className={cn(
                    "text-sm px-2 py-0.5",
                    color === "blue" && "bg-blue-500/20 text-blue-400",
                    color === "purple" && "bg-purple-500/20 text-purple-400",
                    color === "amber" && "bg-amber-500/20 text-amber-400"
                  )}
                >
                  {stat}
                </Badge>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{title}</h3>
              <p className="text-sm text-white/60 mt-1">{description}</p>
            </div>
          </div>
          <div className="flex items-center text-white/40 group-hover:text-white/60 transition-colors pt-4">
            <span className="text-sm">View Details</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

function MatchCard({
  match,
  showStatus = true,
}: {
  match: MatchDto;
  showStatus?: boolean;
}) {
  const container = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden bg-white/10 backdrop-blur-xl border-white/20">
        <div className="p-6 space-y-4">
          <motion.div
            variants={item}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="relative w-16 h-16 rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <PetGallery
                  photos={match.initiatorPet.photos}
                  videos={[]}
                  name={match.initiatorPet.name}
                  petId={match.initiatorPet.id}
                  showAddMedia={false}
                  variant="minimal"
                  aspectRatio="square"
                  className="bg-transparent"
                />
              </motion.div>
              <div>
                <h3 className="text-xl font-medium text-white">
                  {match.initiatorPet.name}
                </h3>
                <p className="text-sm text-white/70">
                  {match.initiatorPet.breed} • {match.initiatorPet.age} years
                </p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Heart className="h-6 w-6 text-pink-400" />
            </motion.div>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-4">
            <motion.div
              className="relative w-16 h-16 rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <PetGallery
                photos={match.targetPet.photos.slice(0, 1)}
                videos={[]}
                name={match.targetPet.name}
                petId={match.targetPet.id}
                showAddMedia={false}
                variant="minimal"
                aspectRatio="square"
                className="bg-transparent"
              />
            </motion.div>
            <div>
              <h3 className="text-xl font-medium text-white">
                {match.targetPet.name}
              </h3>
              <p className="text-sm text-white/70">
                {match.targetPet.breed} • {match.targetPet.age} years
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="flex items-center justify-between pt-4 border-t border-white/20"
          >
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-300 border-0 backdrop-blur-sm">
                {PetPurpose[match.matchPurpose]}
              </Badge>
              {match.status === MatchStatus.Accepted && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="sm"
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border-0 backdrop-blur-sm"
                  >
                    <Link href={`/messages/${match.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      <span>Message</span>
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
            {showStatus && (
              <Badge
                variant="outline"
                className={cn(
                  "border-0 backdrop-blur-sm",
                  match.status === MatchStatus.Pending &&
                    "bg-amber-500/20 text-amber-300",
                  match.status === MatchStatus.Accepted &&
                    "bg-green-500/20 text-green-300",
                  match.status === MatchStatus.Rejected &&
                    "bg-red-500/20 text-red-300"
                )}
              >
                {MatchStatus[match.status]}
              </Badge>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const { data: pets } = useUserPets(user?.id || "");
  const { data: pendingMatches } = useAllPetsPendingMatches(pets);
  const { data: matches, isLoading: matchesLoading } = useAllPetsMatches(pets);

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="relative min-h-screen bg-black/[0.96]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />

      <div className="relative">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight">
                Connect with Pet Lovers
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Around You
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-white/60">
                Create meaningful connections for your pets in a safe and
                friendly environment.
              </p>

              {!isAuthenticated && (
                <motion.div
                  variants={buttonVariants}
                  className="flex justify-center gap-6 mt-12"
                >
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-2xl border-0"
                    >
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl border-0"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {isAuthenticated && (
          <>
            {/* Quick Actions */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <QuickAction
                    title="Find Matches"
                    description={
                      pets?.length
                        ? "Start connecting your pets"
                        : "Add your first pet"
                    }
                    icon={Heart}
                    href={
                      pets?.length ? `/pets/${pets[0].id}/matches` : "/pets/new"
                    }
                    color="blue"
                  />
                  <QuickAction
                    title="My Pets"
                    description={`${pets?.length || 0} pets registered`}
                    icon={PawPrint}
                    href="/pets"
                    color="purple"
                    stat={pets?.length}
                  />
                  <QuickAction
                    title="Pending"
                    description={`${
                      pendingMatches?.length || 0
                    } requests waiting`}
                    icon={Clock}
                    href="/matches"
                    color="amber"
                    stat={pendingMatches?.length}
                  />
                </div>
              </div>
            </section>

            {/* Recent Matches Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-medium text-white">
                      Recent Matches
                    </h2>
                    <p className="text-sm text-white/60 mt-1">
                      {matches?.length || 0} total matches
                    </p>
                  </div>
                </div>

                {matchesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
                    ))}
                  </div>
                ) : matches?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {matches
                      .sort((a, b) => {
                        const dateA = a.expiresAt
                          ? new Date(a.expiresAt)
                          : new Date(0);
                        const dateB = b.expiresAt
                          ? new Date(b.expiresAt)
                          : new Date(0);
                        return dateB.getTime() - dateA.getTime();
                      })
                      .slice(0, 6)
                      .map((match) => (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <MatchCard match={match} showStatus />
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center bg-white/5 border-white/10">
                    <p className="text-white/60">
                      No matches yet. Start connecting with other pets!
                    </p>
                  </Card>
                )}
              </div>
            </section>
            {(pendingMatches?.length ?? 0) > 0 && (
              <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-medium text-white">
                        Pending Matches
                      </h2>
                      <p className="text-sm text-white/60 mt-1">
                        {pendingMatches?.length || 0} pending requests
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5"
                      asChild
                    >
                      <Link href="/matches">
                        View All
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pendingMatches?.map((match) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <MatchCard match={match} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
