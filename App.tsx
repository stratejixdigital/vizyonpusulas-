import React, { useState, useCallback } from 'react';
import { Step, ProjectData, AudienceAnalysis, IrresistibleOffer, AdCopy } from './types';
import StepIndicator from './components/StepIndicator';
import LoadingSpinner from './components/LoadingSpinner';
import { analyzeAudience, generateOfferIdeas, generateAdCopy } from './services/geminiService';

const IntroStep: React.FC<{ onStart: (businessType: string) => void }> = ({ onStart }) => {
  const [businessType, setBusinessType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    if (businessType.trim()) {
      setIsLoading(true);
      onStart(businessType.trim());
    }
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-text mb-4">Vizyon Pusulası</h1>
      <p className="text-lg text-brand-text-light mb-8">AI Destekli Pazarlama Stratejisti</p>
      <div className="bg-brand-light-dark p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-brand-cyan">Başlamadan Önce</h2>
        <p className="mb-6 text-brand-text">Analiz etmek istediğiniz iş alanını veya ürün türünü girin. (Örn: Diyetisyen, E-ticaret için kadın giyim, Gayrimenkul Danışmanı)</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            placeholder="İş Alanı (Örn: Diyetisyen)"
            className="flex-grow bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
            disabled={isLoading}
          />
          <button
            onClick={handleStart}
            className="bg-brand-cyan text-brand-dark font-bold px-8 py-3 rounded-md hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoading || !businessType.trim()}
          >
            {isLoading ? <LoadingSpinner /> : <>Strateji Oluştur <i className="fas fa-arrow-right ml-2"></i></>}
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultsDisplay: React.FC<{ title: string; items: string[]; icon: string; color: string }> = ({ title, items, icon, color }) => (
    <div className="bg-brand-light-dark p-6 rounded-lg shadow-lg">
        <h3 className={`text-xl font-semibold mb-4 ${color}`}><i className={`fas ${icon} mr-3`}></i>{title}</h3>
        <ul className="space-y-3">
            {items.map((item, index) => (
                <li key={index} className="flex items-start">
                    <i className={`fas fa-check-circle mt-1 mr-3 ${color}`}></i>
                    <span className="text-brand-text-light">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const ActionFooter: React.FC<{
  onCopyAll?: () => void;
  onDownload?: () => void;
  onNext?: () => void;
  onDownloadAll?: () => void;
  onReset?: () => void;
  isAllCopied?: boolean;
  nextButtonText?: string;
  isLoading: boolean;
}> = ({ onCopyAll, onDownload, onNext, onDownloadAll, onReset, isAllCopied, nextButtonText, isLoading }) => {
  return (
    <div className="text-center mt-8 flex flex-wrap justify-center items-center gap-4">
      {onCopyAll && (
        <button onClick={onCopyAll} className="bg-brand-light-dark text-brand-text-light font-bold px-6 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center" disabled={isLoading}>
          {isAllCopied ? <><i className="fas fa-check mr-2 text-green-400"></i>Kopyalandı!</> : <><i className="fas fa-clipboard mr-2"></i>Tümünü Kopyala</>}
        </button>
      )}
      {onDownload && (
        <button onClick={onDownload} className="bg-brand-light-dark text-brand-text-light font-bold px-6 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center" disabled={isLoading}>
          <i className="fas fa-download mr-2"></i>İndir (.html)
        </button>
      )}
      {onNext && nextButtonText && (
        <button onClick={onNext} className="bg-brand-cyan text-brand-dark font-bold px-8 py-3 rounded-md hover:bg-cyan-300 transition-colors disabled:opacity-50" disabled={isLoading}>
          {nextButtonText} <i className="fas fa-arrow-right ml-2"></i>
        </button>
      )}
      {onDownloadAll && (
         <button onClick={onDownloadAll} className="bg-green-600 text-white font-bold px-8 py-3 rounded-md hover:bg-green-500 transition-colors flex items-center" disabled={isLoading}>
            <i className="fas fa-file-download mr-2"></i>Tüm Raporu İndir
        </button>
      )}
       {onReset && (
         <button onClick={onReset} className="bg-gray-600 text-white font-bold px-8 py-3 rounded-md hover:bg-gray-500 transition-colors flex items-center" disabled={isLoading}>
            Yeni Proje Başlat <i className="fas fa-sync-alt ml-2"></i>
        </button>
       )}
    </div>
  );
};

// --- Formatting Functions for Text Copy ---
const formatAudienceForExport = (analysis: AudienceAnalysis): string => `
HEDEF KİTLE ANALİZİ
=====================

### Dışsal Problemler ###
${analysis.dışsal_problemler.map(item => `- ${item}`).join('\n')}

### İçsel Problemler ###
${analysis.içsel_problemler.map(item => `- ${item}`).join('\n')}

### Felsefik Sıkışmalar ###
${analysis.felsefik_sıkışmalar.map(item => `- ${item}`).join('\n')}
`.trim();

const formatOfferForExport = (offer: IrresistibleOffer): string => `
KARŞI KONULAMAZ TEKLİF FİKİRLERİ
==================================

### Arzulanan Sonuç ###
${offer.arzulanan_sonuç_önerileri.map(item => `- ${item}`).join('\n')}

### Ulaşma İhtimali Artırıcılar ###
${offer.ulaşma_ihtimali_arttırıcılar.map(item => `- ${item}`).join('\n')}

### Zaman Kazandırıcılar ###
${offer.zaman_kazandırıcılar.map(item => `- ${item}`).join('\n')}

### Efor Azaltıcılar ###
${offer.efor_azaltıcılar.map(item => `- ${item}`).join('\n')}
`.trim();

const formatCopyForExport = (copy: AdCopy): string => `
REKLAM METİNLERİ
================

${copy.reklam_metinleri.map((text, index) => `
### Reklam Metni Versiyon ${index + 1} ###
-------------------------
${text}
-------------------------
`).join('\n\n')}
`.trim();

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('intro');
  const [projectData, setProjectData] = useState<ProjectData>({
    businessType: '',
    audienceAnalysis: null,
    irresistibleOffer: null,
    adCopy: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState<Record<number, boolean>>({});
  const [isAllCopied, setIsAllCopied] = useState(false);

  const downloadAsHtml = useCallback((htmlContent: string, filename: string, title: string) => {
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="tr">
        <head>
          <meta charset="UTF-8" />
          <title>${title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    'brand-cyan': '#22d3ee',
                    'brand-dark': '#0f172a',
                    'brand-light-dark': '#1e293b',
                    'brand-text': '#e2e8f0',
                    'brand-text-light': '#94a3b8',
                  }
                }
              }
            }
          </script>
        </head>
        <body class="bg-brand-dark text-brand-text font-sans antialiased p-8">
          <div class="container mx-auto">
            <h1 class="text-3xl font-bold text-brand-cyan mb-6">${title}</h1>
            ${htmlContent}
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadHtml = useCallback((elementId: string, filename: string, title: string) => {
    const contentElement = document.getElementById(elementId);
    if (contentElement) {
        downloadAsHtml(contentElement.innerHTML, filename, title);
    }
  }, [downloadAsHtml]);
  
  const generateSectionHtml = (title: string, items: string[], icon: string, color: string): string => {
    return `
      <div class="bg-brand-light-dark p-6 rounded-lg shadow-lg" style="break-inside: avoid;">
        <h3 class="text-xl font-semibold mb-4 ${color}"><i class="fas ${icon} mr-3"></i>${title}</h3>
        <ul class="space-y-3">
          ${items.map(item => `
            <li class="flex items-start">
              <i class="fas fa-check-circle mt-1 mr-3 ${color}"></i>
              <span class="text-brand-text-light">${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  };

  const handleDownloadAllHtml = useCallback(() => {
    if (!projectData.audienceAnalysis || !projectData.irresistibleOffer || !projectData.adCopy || !projectData.businessType) {
        return;
    }

    const { audienceAnalysis, irresistibleOffer, adCopy, businessType } = projectData;

    const audienceHtml = `
      <div id="audience-analysis-content">
        <h2 class="text-3xl font-bold text-center mb-6">Hedef Kitle Analizi: <span class="text-brand-cyan">${businessType}</span></h2>
        <div class="grid md:grid-cols-3 gap-6">
            ${generateSectionHtml("Dışsal Problemler", audienceAnalysis.dışsal_problemler, "fa-person-running", "text-red-400")}
            ${generateSectionHtml("İçsel Problemler", audienceAnalysis.içsel_problemler, "fa-cloud-bolt", "text-yellow-400")}
            ${generateSectionHtml("Felsefik Sıkışmalar", audienceAnalysis.felsefik_sıkışmalar, "fa-scale-unbalanced-flip", "text-purple-400")}
        </div>
      </div>
    `;

    const offerHtml = `
      <div id="offer-ideas-content">
        <h2 class="text-3xl font-bold text-center mb-6" style="margin-top: 2rem;">Karşı Konulamaz Teklif Fikirleri</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${generateSectionHtml("Arzulanan Sonuç", irresistibleOffer.arzulanan_sonuç_önerileri, "fa-trophy", "text-green-400")}
            ${generateSectionHtml("Ulaşma İhtimali Artırıcılar", irresistibleOffer.ulaşma_ihtimali_arttırıcılar, "fa-shield-halved", "text-blue-400")}
            ${generateSectionHtml("Zaman Kazandırıcılar", irresistibleOffer.zaman_kazandırıcılar, "fa-hourglass-half", "text-orange-400")}
            ${generateSectionHtml("Efor Azaltıcılar", irresistibleOffer.efor_azaltıcılar, "fa-couch", "text-indigo-400")}
        </div>
      </div>
    `;

    const copyHtml = `
      <div id="ad-copy-content">
          <h2 class="text-3xl font-bold text-center mb-6" style="margin-top: 2rem;">AI Tarafından Oluşturulan Reklam Metinleri</h2>
          <div class="space-y-6">
              ${adCopy.reklam_metinleri.map((text, index) => `
                 <div class="bg-brand-light-dark p-6 rounded-lg shadow-lg relative" style="break-inside: avoid;">
                     <h3 class="text-lg font-semibold mb-3 text-brand-cyan">Reklam Metni Versiyon ${index + 1}</h3>
                     <p class="text-brand-text-light whitespace-pre-line">${text}</p>
                 </div>
              `).join('')}
          </div>
      </div>
    `;

    const fullContent = `
        ${audienceHtml}
        <hr class="my-12 border-gray-600"/>
        ${offerHtml}
        <hr class="my-12 border-gray-600"/>
        ${copyHtml}
    `;
    
    downloadAsHtml(fullContent, `${businessType}-tam-rapor.html`, `Vizyon Pusulası Raporu: ${businessType}`);
  }, [projectData, downloadAsHtml]);


  const resetApp = useCallback(() => {
    setStep('intro');
    setProjectData({
      businessType: '',
      audienceAnalysis: null,
      irresistibleOffer: null,
      adCopy: null,
    });
    setError(null);
    setIsLoading(false);
    setCopiedState({});
  }, []);

  const handleStartAnalysis = useCallback(async (businessType: string) => {
    setIsLoading(true);
    setError(null);
    setProjectData({ ...projectData, businessType });
    setStep('audience');
    try {
      const analysis = await analyzeAudience(businessType);
      setProjectData(pd => ({ ...pd, audienceAnalysis: analysis }));
    } catch (e: any) {
      setError(e.message);
      setStep('intro');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateOffer = useCallback(async () => {
    if (!projectData.businessType || !projectData.audienceAnalysis) return;
    setIsLoading(true);
    setError(null);
    setStep('offer');
    try {
      const offer = await generateOfferIdeas(projectData.businessType, projectData.audienceAnalysis);
      setProjectData(pd => ({ ...pd, irresistibleOffer: offer }));
    } catch (e: any) {
      setError(e.message);
      setStep('audience'); // Go back to previous step on error
    } finally {
      setIsLoading(false);
    }
  }, [projectData]);
  
  const handleGenerateCopy = useCallback(async () => {
    if (!projectData.businessType || !projectData.audienceAnalysis || !projectData.irresistibleOffer) return;
    setIsLoading(true);
    setError(null);
    setStep('copy');
    try {
      const copy = await generateAdCopy(projectData.businessType, projectData.audienceAnalysis, projectData.irresistibleOffer);
      setProjectData(pd => ({ ...pd, adCopy: copy }));
    } catch (e: any) {
      setError(e.message);
      setStep('offer'); // Go back to previous step on error
    } finally {
      setIsLoading(false);
    }
  }, [projectData]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedState(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
        setCopiedState(prev => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const handleCopyAll = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setIsAllCopied(true);
    setTimeout(() => setIsAllCopied(false), 2000);
  }, []);

  const renderContent = () => {
    if (step === 'intro' && !isLoading) {
      return <IntroStep onStart={handleStartAnalysis} />;
    }

    if (error) {
        return (
            <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
                <p className="font-bold text-lg">Bir Hata Oluştu!</p>
                <p>{error}</p>
                <button onClick={resetApp} className="mt-4 bg-brand-cyan text-brand-dark font-bold px-6 py-2 rounded-md hover:bg-cyan-300">Yeniden Başla</button>
            </div>
        );
    }

    switch (step) {
      case 'audience':
        return (
            <div className="animate-fade-in">
                 {isLoading || !projectData.audienceAnalysis ? <LoadingSpinner /> : (
                    <div id="audience-analysis-content">
                        <h2 className="text-3xl font-bold text-center mb-6">Hedef Kitle Analizi: <span className="text-brand-cyan">{projectData.businessType}</span></h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <ResultsDisplay title="Dışsal Problemler" items={projectData.audienceAnalysis.dışsal_problemler} icon="fa-person-running" color="text-red-400" />
                            <ResultsDisplay title="İçsel Problemler" items={projectData.audienceAnalysis.içsel_problemler} icon="fa-cloud-bolt" color="text-yellow-400" />
                            <ResultsDisplay title="Felsefik Sıkışmalar" items={projectData.audienceAnalysis.felsefik_sıkışmalar} icon="fa-scale-unbalanced-flip" color="text-purple-400" />
                        </div>
                        <ActionFooter
                            onCopyAll={() => handleCopyAll(formatAudienceForExport(projectData.audienceAnalysis!))}
                            onDownload={() => handleDownloadHtml('audience-analysis-content', `${projectData.businessType}-hedef-kitle.html`, `Hedef Kitle Analizi: ${projectData.businessType}`)}
                            onNext={handleGenerateOffer}
                            isAllCopied={isAllCopied}
                            nextButtonText="Sonraki Adım: Karşı Konulamaz Teklif"
                            isLoading={false}
                        />
                    </div>
                )}
            </div>
        );
      case 'offer':
        return (
            <div className="animate-fade-in">
                 {isLoading || !projectData.irresistibleOffer ? <LoadingSpinner /> : (
                    <div id="offer-ideas-content">
                        <h2 className="text-3xl font-bold text-center mb-6">Karşı Konulamaz Teklif Fikirleri</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ResultsDisplay title="Arzulanan Sonuç" items={projectData.irresistibleOffer.arzulanan_sonuç_önerileri} icon="fa-trophy" color="text-green-400" />
                            <ResultsDisplay title="Ulaşma İhtimali Artırıcılar" items={projectData.irresistibleOffer.ulaşma_ihtimali_arttırıcılar} icon="fa-shield-halved" color="text-blue-400" />
                            <ResultsDisplay title="Zaman Kazandırıcılar" items={projectData.irresistibleOffer.zaman_kazandırıcılar} icon="fa-hourglass-half" color="text-orange-400" />
                            <ResultsDisplay title="Efor Azaltıcılar" items={projectData.irresistibleOffer.efor_azaltıcılar} icon="fa-couch" color="text-indigo-400" />
                        </div>
                         <ActionFooter
                            onCopyAll={() => handleCopyAll(formatOfferForExport(projectData.irresistibleOffer!))}
                            onDownload={() => handleDownloadHtml('offer-ideas-content', `${projectData.businessType}-teklif.html`, `Teklif Fikirleri: ${projectData.businessType}`)}
                            onNext={handleGenerateCopy}
                            isAllCopied={isAllCopied}
                            nextButtonText="Sonraki Adım: Reklam Metni Oluştur"
                            isLoading={false}
                        />
                    </div>
                )}
            </div>
        );
    case 'copy':
        return (
            <div className="animate-fade-in">
                {isLoading || !projectData.adCopy ? <LoadingSpinner /> : (
                    <div id="ad-copy-content">
                        <h2 className="text-3xl font-bold text-center mb-6">AI Tarafından Oluşturulan Reklam Metinleri</h2>
                        <div className="space-y-6">
                            {projectData.adCopy.reklam_metinleri.map((text, index) => (
                               <div key={index} className="bg-brand-light-dark p-6 rounded-lg shadow-lg relative">
                                   <h3 className="text-lg font-semibold mb-3 text-brand-cyan">Reklam Metni Versiyon {index + 1}</h3>
                                   <p className="text-brand-text-light whitespace-pre-line">{text}</p>
                                   <button 
                                     onClick={() => handleCopy(text, index)}
                                     className="absolute top-4 right-4 bg-gray-700 text-brand-text-light px-3 py-1 rounded-md text-xs hover:bg-gray-600 transition-colors flex items-center"
                                     aria-label={`Reklam Metni ${index + 1} kopyala`}
                                   >
                                    {copiedState[index] ? (
                                        <>
                                            <i className="fas fa-check mr-2 text-green-400"></i>Kopyalandı
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-copy mr-2"></i>Kopyala
                                        </>
                                    )}
                                   </button>
                               </div>
                            ))}
                        </div>
                        <ActionFooter
                            onCopyAll={() => handleCopyAll(formatCopyForExport(projectData.adCopy!))}
                            isAllCopied={isAllCopied}
                            onDownload={() => handleDownloadHtml('ad-copy-content', `${projectData.businessType}-reklam-metinleri.html`, `Reklam Metinleri: ${projectData.businessType}`)}
                            onDownloadAll={handleDownloadAllHtml}
                            onReset={resetApp}
                            isLoading={false}
                        />
                    </div>
                )}
            </div>
        );
      default:
        return <LoadingSpinner />;
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8 flex flex-col items-center">
      <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <i className="fas fa-compass text-brand-cyan text-3xl"></i>
          <span className="text-xl font-semibold hidden sm:block">Vizyon Pusulası</span>
        </div>
        {step !== 'intro' && (
             <button onClick={resetApp} className="text-sm bg-brand-light-dark px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
               <i className="fas fa-sync-alt mr-2"></i>Yeni Proje
            </button>
        )}
      </header>
      
      {step !== 'intro' && <StepIndicator currentStep={step} />}
      
      <main className="w-full max-w-5xl flex-grow flex flex-col justify-center">
        {renderContent()}
      </main>
      
      <footer className="w-full max-w-5xl text-center mt-12 text-brand-text-light text-sm">
        <p>Fatih Çoban'ın "Vizyon Pusulası" kampından ilham alarak Gemini API ile oluşturulmuştur.</p>
      </footer>
    </div>
  );
};

export default App;
