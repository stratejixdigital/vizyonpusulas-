import { GoogleGenAI, Type } from "@google/genai";
import { AudienceAnalysis, IrresistibleOffer, AdCopy } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. Please provide a valid API key for Gemini functionality.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const model = 'gemini-2.5-flash';

export const analyzeAudience = async (businessType: string): Promise<AudienceAnalysis> => {
  const prompt = `Sen dünya standartlarında bir pazarlama stratejistisin. '${businessType}' işi için hedef kitlenin şu analizini yapmanı istiyorum:
  1. Dışsal Problemler (Farkında oldukları, dile getirdikleri somut sorunlar).
  2. İçsel Problemler (Dışsal problemlerin neden olduğu içsel duygular, güvensizlikler, korkular).
  3. Felsefik Sıkışmalar (Bu durumun yarattığı '...böyle olmamalıydı' dedirten varoluşsal, felsefik ikilemler ve adaletsizlik hissi).
  
  Lütfen bu analizi, verdiğim şemaya tam olarak uyacak şekilde JSON formatında oluştur.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dışsal_problemler: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hedef kitlenin farkında olduğu somut, dışsal sorunlar." },
            içsel_problemler: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Dışsal problemlerin yol açtığı içsel, duygusal sorunlar." },
            felsefik_sıkışmalar: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hedef kitlenin 'bu haksızlık' veya 'böyle olmamalıydı' dediği felsefik çatışmalar." }
          },
          required: ['dışsal_problemler', 'içsel_problemler', 'felsefik_sıkışmalar']
        },
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini API error in analyzeAudience:", error);
    throw new Error("Hedef kitle analizi sırasında bir hata oluştu. API anahtarınızı kontrol ediniz.");
  }
};

export const generateOfferIdeas = async (businessType: string, analysis: AudienceAnalysis): Promise<IrresistibleOffer> => {
  const prompt = `Sen Alex Hormozi gibi karşı konulamaz teklifler oluşturan bir pazarlama dehasısın. '${businessType}' işi için bir teklif oluşturacağız.
  Hedef kitlenin temel sorunları şunlar: Felsefik Sıkışmalar: ${analysis.felsefik_sıkışmalar.join(', ')}. İçsel Problemler: ${analysis.içsel_problemler.join(', ')}.
  
  Mükemmel teklif formülünü kullan: Değer = (Arzulanan Sonuç * Ulaşma İhtimali) / (Zaman * Emek).
  
  Bu formüle göre, müşterinin harcayacağı 'Zaman' ve 'Emek' faktörlerini sıfıra yaklaştıracak öneriler sun. 'Ulaşma İhtimali'ni garantiler ve sosyal kanıtlarla maksimuma çıkaracak fikirler ver. 'Arzulanan Sonuç'u net ve çekici hale getirecek önerilerde bulun.
  
  Lütfen bu önerileri verdiğim şemaya uygun JSON formatında oluştur.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arzulanan_sonuç_önerileri: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Müşterinin hayalindeki sonucu tanımlayan net ve güçlü ifadeler." },
            ulaşma_ihtimali_arttırıcılar: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Riski azaltan garantiler, sosyal kanıtlar ve güven artırıcılar." },
            zaman_kazandırıcılar: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sonuca ulaşma süresini kısaltan 'sizin için yapalım' tarzı hizmetler veya araçlar." },
            efor_azaltıcılar: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Müşterinin harcaması gereken fiziksel veya zihinsel çabayı azaltan kolaylıklar." }
          },
          required: ['arzulanan_sonuç_önerileri', 'ulaşma_ihtimali_arttırıcılar', 'zaman_kazandırıcılar', 'efor_azaltıcılar']
        },
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini API error in generateOfferIdeas:", error);
    throw new Error("Teklif oluşturma sırasında bir hata oluştu. API anahtarınızı kontrol ediniz.");
  }
};

export const generateAdCopy = async (businessType: string, analysis: AudienceAnalysis, offer: IrresistibleOffer): Promise<AdCopy> => {
  const prompt = `Sen usta bir metin yazarısın. '${businessType}' işi için, Facebook ve Instagram'da kullanılacak 3 farklı reklam metni yaz.
  
  Stratejimiz şu:
  - Hedef Kitle'nin en derin sıkışmışlık hissi: "${analysis.felsefik_sıkışmalar[0]}"
  - Teklifimizin en güçlü vaatleri: Zaman Kazandırıcılar: "${offer.zaman_kazandırıcılar.join(', ')}", Efor Azaltıcılar: "${offer.efor_azaltıcılar.join(', ')}".
  
  Metinleri 'Olta, Hikaye, Çözüm, Harekete Geçirici Mesaj (CTA)' yapısına uygun olarak yaz. Okuyucunun problemini anladığını hissettir, çözümün ne kadar kolay ve etkili olduğunu göster ve net bir şekilde ne yapması gerektiğini söyle.
  
  Lütfen bu metinleri verdiğim şemaya uygun JSON formatında, 'reklam_metinleri' anahtarı altında bir dizi olarak oluştur.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reklam_metinleri: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Her biri tam bir reklam metni olan 3 farklı metin." }
          },
          required: ['reklam_metinleri']
        },
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini API error in generateAdCopy:", error);
    throw new Error("Reklam metni oluşturma sırasında bir hata oluştu. API anahtarınızı kontrol ediniz.");
  }
};
