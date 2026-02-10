import { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function AddToHomeScreenModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Check if already seen or already installed
        const hasSeen = localStorage.getItem('hasSeenInstallPrompt');
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        if (hasSeen || isStandalone) return;

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // For Android/Desktop (Chrome)
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsOpen(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS, show immediately after a small delay if not seen
        if (isIosDevice) {
            const timer = setTimeout(() => setIsOpen(true), 3000);
            return () => clearTimeout(timer);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleClose = () => {
        localStorage.setItem('hasSeenInstallPrompt', 'true');
        setIsOpen(false);
    };

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                handleClose();
            }
            setDeferredPrompt(null);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Installa l'App"
            size="sm"
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-2">
                    <img src="/pwa-192x192.png" alt="App Icon" className="w-12 h-12 rounded-xl object-contain" onError={(e) => {
                        // Fallback if image not found
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl">🏠</span>';
                    }} />
                </div>

                <p className="text-text-secondary">
                    Installa <strong>Affittochiaro</strong> sulla tua schermata home per un accesso più rapido e un'esperienza migliore a schermo intero.
                </p>

                {isIOS ? (
                    <div className="bg-background-secondary p-4 rounded-xl text-sm text-left w-full space-y-3">
                        <div className="flex items-center gap-3">
                            <Share size={20} className="text-primary-500" />
                            <span>1. Tocca il pulsante <strong>Condividi</strong> nella barra degli strumenti.</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <PlusSquare size={20} className="text-primary-500" />
                            <span>2. Scorri in basso e seleziona <strong>Aggiungi alla schermata Home</strong>.</span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full pt-2">
                        <Button onClick={handleInstallClick} className="w-full">
                            Installa Ora
                        </Button>
                    </div>
                )}

                <button
                    onClick={handleClose}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                    Forse più tardi
                </button>
            </div>
        </Modal>
    );
}
