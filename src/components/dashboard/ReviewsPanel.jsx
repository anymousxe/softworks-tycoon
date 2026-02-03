import React from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import { REVIEWS_DB } from '../../data/models';

const ReviewsPanel = () => {
    const { activeCompany } = useGameStore();
    const models = activeCompany?.models || [];
    const liveModels = models.filter(m => m.released || m.status === 'live');

    // Generate fake reviews based on model quality
    const generateReviews = (model) => {
        const quality = model.quality || 50;
        let pool = REVIEWS_DB.mid;
        if (quality >= 90) pool = REVIEWS_DB.god;
        else if (quality >= 70) pool = REVIEWS_DB.high;
        else if (quality < 40) pool = REVIEWS_DB.low;

        return pool.slice(0, 3).map((text, i) => ({
            id: i,
            text,
            rating: quality >= 70 ? 5 : quality >= 50 ? 3 : 1,
            positive: quality >= 50
        }));
    };

    return (
        <div className="animate-in space-y-10">
            <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Reviews</h1>
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-cyan-500"></div>
                    <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Public Perception</p>
                </div>
            </div>

            {liveModels.length === 0 ? (
                <div className="glass-panel p-12 text-center border-dashed border-white/10 bg-transparent">
                    <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-slate-600 uppercase mb-2">No Reviews Yet</h3>
                    <p className="text-slate-700 text-sm">Release a model to receive public feedback</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {liveModels.map(model => (
                        <div key={model.id} className="glass-panel p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{model.name}</h3>
                                    <p className="text-slate-500 text-xs font-mono uppercase">{model.type}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star
                                            key={s}
                                            className={`w-4 h-4 ${s <= Math.ceil((model.quality || 50) / 20) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                {generateReviews(model).map(review => (
                                    <div key={review.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                                        {review.positive ? (
                                            <ThumbsUp className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                                        ) : (
                                            <ThumbsDown className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                                        )}
                                        <p className="text-slate-400 text-sm italic">"{review.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsPanel;
