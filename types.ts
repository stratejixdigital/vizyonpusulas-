export type Step = 'intro' | 'audience' | 'offer' | 'copy';

export interface AudienceAnalysis {
  dışsal_problemler: string[];
  içsel_problemler: string[];
  felsefik_sıkışmalar: string[];
}

export interface IrresistibleOffer {
  arzulanan_sonuç_önerileri: string[];
  ulaşma_ihtimali_arttırıcılar: string[];
  zaman_kazandırıcılar: string[];
  efor_azaltıcılar: string[];
}

export interface AdCopy {
  reklam_metinleri: string[];
}

export interface ProjectData {
  businessType: string;
  audienceAnalysis: AudienceAnalysis | null;
  irresistibleOffer: IrresistibleOffer | null;
  adCopy: AdCopy | null;
}
