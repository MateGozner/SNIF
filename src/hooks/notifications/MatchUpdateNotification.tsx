import { MatchDto, MatchStatus } from "@/lib/types/match";

export const MatchUpdateNotification = ({
  match,
  message,
}: {
  match: MatchDto;
  message: string;
}) => {
  const getStatusColor = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.Accepted:
        return "from-green-500/90 to-emerald-600/90";
      case MatchStatus.Rejected:
        return "from-red-500/90 to-rose-600/90";
      case MatchStatus.Expired:
        return "from-gray-500/90 to-gray-600/90";
      default:
        return "from-blue-500/90 to-indigo-600/90";
    }
  };

  return (
    <div className="max-w-md w-full bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <div
        className={`relative h-24 bg-gradient-to-r ${getStatusColor(
          match.status
        )}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            {match.status === MatchStatus.Accepted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-green-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
            ) : match.status === MatchStatus.Rejected ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-red-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-gray-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-medium text-white mb-2">Match Update</h3>
        <p className="text-gray-300">
          <span className="font-medium">{match.targetPet.name}</span> {message}
        </p>
      </div>
    </div>
  );
};
