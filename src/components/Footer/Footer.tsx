import FacebookIcon from "@/assets/icon_facebook.svg";
import InstagramIcon from "@/assets/icon_instagram.svg";
import XIcon from "@/assets/icon_X.svg";
import YoutubeIcon from "@/assets/icon_youtube.svg";

export const Footer = () => {
  return (
    <footer className="w-full py-8 md:py-10 md:min-h-[140px] lg:py-8 px-6 md:px-[30px] lg:px-50 border-t border-gray-100">
      {/* 모바일 레이아웃 */}
      <div className="flex flex-col gap-4 md:hidden text-center">
        {/* 1줄: Privacy Policy · FAQ */}
        <div className="flex justify-center gap-4 text-sm text-gray-400">
          <a href="/privacy" className="hover:text-gray-700">
            Privacy Policy
          </a>
          <span className="text-gray-400">·</span>
          <a href="/faq" className="hover:text-gray-700">
            FAQ
          </a>
        </div>

        {/* 2줄: codeit | 아이콘들 */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            ©codeit - 2023
          </p>
          
          <div className="flex gap-3">
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
      </div>

      {/* 태블릿/데스크톱 레이아웃 */}
      <div className="hidden md:grid grid-cols-3 items-center gap-8 lg:gap-4 h-full">
        <p className="text-sm text-gray-400 justify-self-start">
          ©codeit - 2023
        </p>

        <div className="flex justify-center gap-6 lg:gap-4 text-sm text-gray-400">
          <a href="/privacy" className="hover:text-gray-700">
            Privacy Policy
          </a>
          <span className="text-gray-400">·</span>
          <a href="/faq" className="hover:text-gray-700">
            FAQ
          </a>
        </div>

        <div className="flex justify-self-end gap-4 lg:gap-3">
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