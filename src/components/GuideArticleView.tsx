import React from 'react';
import { SeoGuideArticle, SEO_GUIDES } from '../data/seoPages';
import {
  BookOpen,
  ChevronRight,
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface GuideArticleViewProps {
  article: SeoGuideArticle;
  onNavigatePath: (path: string) => void;
  onOrderNow: () => void;
}

export const GuideArticleView: React.FC<GuideArticleViewProps> = ({
  article,
  onNavigatePath,
  onOrderNow,
}) => {
  const relatedArticles = SEO_GUIDES.filter((g) =>
    article.relatedGuides?.includes(g.slug)
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-16 space-y-8">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto">
          <button
            onClick={() => onNavigatePath('/')}
            className="hover:text-red-600 transition"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => onNavigatePath('/guides')}
            className="hover:text-red-600 transition"
          >
            Guides & Knowledge Hub
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-red-600 font-bold truncate">{article.h1}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Article Container */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-slate-200/80 space-y-8">
          
          {/* Category & Meta */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                {article.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Updated August 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {article.h1}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed font-normal border-l-4 border-red-600 pl-4 py-1 bg-red-50/40 rounded-r-xl">
              {article.excerpt}
            </p>
          </div>

          {/* Body Sections */}
          <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-8">
            {article.sections.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {sec.heading}
                </h2>
                <p className="text-slate-600 leading-relaxed">{sec.content}</p>
                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-2 pt-1 pl-2">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* FAQs if present */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {article.faqs.map((f, fIdx) => (
                  <div key={fIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1 text-xs sm:text-sm">
                    <p className="font-bold text-slate-900">Q: {f.question}</p>
                    <p className="text-slate-600">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Author/Editorial Trust Box */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> GoPVC Technical Review Board
              </p>
              <p className="text-slate-500">
                Verified against ISO/IEC 7810 ID-1 card manufacturing specifications and official Indian e-governance standards.
              </p>
            </div>
            <button
              onClick={onOrderNow}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shrink-0 cursor-pointer"
            >
              Order Cards
            </button>
          </div>

        </article>

        {/* Related Guides Hub */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Related Guides & Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <button
                  key={rel.slug}
                  onClick={() => onNavigatePath(rel.path)}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-red-200 hover:shadow-md transition text-left space-y-2 group cursor-pointer"
                >
                  <div className="text-[11px] font-bold uppercase text-red-600">{rel.category}</div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-red-600 transition">
                    {rel.h1}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{rel.excerpt}</p>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
