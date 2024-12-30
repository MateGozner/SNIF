import { MatchDto } from "@/lib/types/match";

export const NewMatchNotification = ({ match }: { match: MatchDto }) => (
  <div className="max-w-md w-full bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10">
    <div className="relative h-32 bg-gradient-to-r from-[#FF3868] to-[#FFB49A]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[#FF3868]"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-xl font-medium text-white mb-2">New Match!</h3>
      <p className="text-gray-300">
        <span className="font-medium">{match.initiatorPet.name}</span> wants to
        connect with <span className="font-medium">{match.targetPet.name}</span>
      </p>
    </div>
  </div>
);
