import FacebookIcon from "@/assets/icon_facebook.svg";
import InstagramIcon from "@/assets/icon_instagram.svg";
import XIcon from "@/assets/icon_X.svg";
import YoutubeIcon from "@/assets/icon_youtube.svg";

export const Footer = () => {
  return (
    <footer className="w-full py-8 px-50">
      <div className="grid grid-cols-3 items-center">
        <p className="text-sm text-gray-400 justify-self-start">
          © codeit-2023
        </p>

        <div className="flex justify-center gap-4 text-sm text-gray-400">
          <a href="/privacy" className="hover:text-gray-700">
            Privacy Policy
          </a>
          <a href="/faq" className="hover:text-gray-700">
            FAQ
          </a>
        </div>

        <div className="flex justify-self-end gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FacebookIcon width={20} height={20} />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon width={20} height={20} />
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Youtube"
          >
            <YoutubeIcon width={20} height={20} />
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <XIcon width={20} height={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};
