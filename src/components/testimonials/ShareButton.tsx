/**
 * ShareButton Component
 * Social sharing functionality
 */

'use client';

import { useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  onShare?: (platform: string) => void;
}

export function ShareButton({
  url,
  title,
  description,
  onShare,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: '👍',
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        onShare?.('facebook');
      },
    },
    {
      name: 'Twitter',
      icon: '𝕏',
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        onShare?.('twitter');
      },
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      action: () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedinUrl, '_blank', 'width=600,height=400');
        onShare?.('linkedin');
      },
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        window.open(whatsappUrl, '_blank');
        onShare?.('whatsapp');
      },
    },
    {
      name: 'Email',
      icon: '✉️',
      action: () => {
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description || title + '\n' + url)}`;
        window.location.href = mailtoUrl;
        onShare?.('email');
      },
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare?.('copy');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <span>📤</span>
        Share
      </button>

      {/* Share Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 min-w-max">
          {/* Share Options */}
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => {
                option.action();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0 flex items-center gap-3"
            >
              <span className="text-xl">{option.icon}</span>
              <span className="font-medium text-foreground">{option.name}</span>
            </button>
          ))}

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Copy Link */}
          <button
            onClick={() => {
              handleCopyLink();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3"
          >
            <span className="text-xl">🔗</span>
            <span className="font-medium text-foreground">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>
        </div>
      )}

      {/* Close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Info */}
      <div className="mt-2 text-xs text-muted-foreground">
        Share this testimonial with your network
      </div>
    </div>
  );
}

