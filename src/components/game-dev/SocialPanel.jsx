import React, { useState } from 'react';
import {
    MessageCircle, Video, Heart, Repeat2, Send, Plus,
    ThumbsUp, ThumbsDown, Eye, Users, Sparkles, AlertCircle,
    Trash2, X, MoreVertical
} from 'lucide-react';
import useGameDevStore, { RANDOM_USERNAMES } from '../../store/gameDevStore';

// Delete Confirmation Modal
const DeleteConfirmModal = ({ title, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-8">
        <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-red-500/20 mx-auto mb-6 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Delete {title}?</h2>
            <p className="text-slate-400 text-center mb-8">This action cannot be undone.</p>
            <div className="flex gap-4">
                <button onClick={onCancel} className="flex-1 py-3 bg-slate-800 rounded-xl text-slate-400 font-bold">Cancel</button>
                <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-bold">Delete</button>
            </div>
        </div>
    </div>
);

// Z Post Component (Twitter/X parody)
const ZPost = ({ post, studioName, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 relative group">
            {/* Delete Menu Button */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <MoreVertical className="w-4 h-4 text-slate-500" />
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-white/10 rounded-xl overflow-hidden z-10 shadow-xl">
                        <button
                            onClick={() => { onDelete(post.id); setShowMenu(false); }}
                            className="px-4 py-3 flex items-center gap-2 text-red-400 hover:bg-red-500/10 w-full text-left"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Post
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {studioName?.[0] || 'S'}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{studioName}</span>
                        <span className="text-slate-500 text-sm">@{studioName?.toLowerCase().replace(/\s/g, '')} • {post.postedAt.month}/{post.postedAt.year}</span>
                    </div>
                    <p className="text-slate-300 mb-3">{post.content}</p>
                    {/* Engagement */}
                    <div className="flex items-center gap-6 text-slate-500 text-sm">
                        <button className="flex items-center gap-1 hover:text-pink-400 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes.toLocaleString()}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                            <Repeat2 className="w-4 h-4" />
                            <span>{post.reposts.toLocaleString()}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments.length}</span>
                        </button>
                    </div>
                    {/* Comments */}
                    {post.comments.length > 0 && (
                        <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                            {post.comments.slice(0, 3).map((comment, i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                                        {comment.username?.[0] || '?'}
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-xs font-bold">@{comment.username}</span>
                                        <p className="text-slate-500 text-sm">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// YouVideo Video Component
const YouVideoCard = ({ video, studioName, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden group relative">
            {/* Delete Menu Button */}
            <div className="absolute top-2 right-2 z-10">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <MoreVertical className="w-4 h-4 text-white" />
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                        <button
                            onClick={() => { onDelete(video.id); setShowMenu(false); }}
                            className="px-4 py-3 flex items-center gap-2 text-red-400 hover:bg-red-500/10 w-full text-left"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Video
                        </button>
                    </div>
                )}
            </div>

            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center relative">
                <Video className="w-16 h-16 text-red-400" />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-white text-xs">
                    3:24
                </div>
            </div>
            <div className="p-4">
                <h4 className="font-bold text-white line-clamp-2 mb-2">{video.title}</h4>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <span>{studioName}</span>
                    <span>•</span>
                    <span>{video.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm">
                    <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {video.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <ThumbsDown className="w-4 h-4" />
                        {video.dislikes.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

// Social Media Panel
const SocialPanel = () => {
    const {
        studio, zPosts, youVideoPosts, zFollowers, youVideoSubscribers,
        postToZ, postToYouVideo, deleteZPost, deleteYouVideo, releasedGames
    } = useGameDevStore();

    const [activeTab, setActiveTab] = useState('z');
    const [showCompose, setShowCompose] = useState(false);
    const [newPost, setNewPost] = useState({ content: '', title: '', description: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Generate fake comments (simulating AI)
    const generateComments = (content) => {
        // Check for inappropriate content (basic filter)
        const badWords = ['hitler', 'rape', 'nazi', 'kill'];
        const lowerContent = content.toLowerCase();
        if (badWords.some(word => lowerContent.includes(word))) {
            return null; // Return null to indicate content moderation failure
        }

        // Generate 10 random comments
        const positiveComments = [
            "This looks amazing! Can't wait!",
            "Day one purchase for me!",
            "The graphics look insane 🔥",
            "Finally some good content",
            "This is going to be epic!",
            "I've been waiting for this!",
            "Take my money already!",
            "Best announcement this year!",
            "The hype is real!",
            "This is exactly what I needed"
        ];

        const neutralComments = [
            "Interesting, I'll keep an eye on this",
            "Looks decent, hope it delivers",
            "When is the release date?",
            "Will there be a demo?",
            "What platforms will it be on?",
            "Hoping for good optimization",
            "Need to see more gameplay",
            "Price?",
            "Steam deck compatible?",
            "Seems promising"
        ];

        const comments = [];
        for (let i = 0; i < 10; i++) {
            const isPositive = Math.random() > 0.3;
            const pool = isPositive ? positiveComments : neutralComments;
            comments.push({
                username: RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)],
                text: pool[Math.floor(Math.random() * pool.length)],
                likes: Math.floor(Math.random() * 500)
            });
        }
        return comments;
    };

    const handlePostToZ = () => {
        if (!newPost.content.trim()) return;

        setIsGenerating(true);
        setError(null);

        // Simulate API call delay
        setTimeout(() => {
            const comments = generateComments(newPost.content);

            if (comments === null) {
                setError('Content moderation failed. Please revise your post.');
                setIsGenerating(false);
                return;
            }

            const post = postToZ(newPost.content);
            // Add generated comments (in real app, this would update the store)
            post.comments = comments;
            post.likes = Math.floor(Math.random() * 10000);
            post.reposts = Math.floor(Math.random() * 2000);

            setNewPost({ content: '', title: '', description: '' });
            setShowCompose(false);
            setIsGenerating(false);
        }, 1000);
    };

    const handlePostToYouVideo = () => {
        if (!newPost.title.trim()) return;

        setIsGenerating(true);
        setError(null);

        setTimeout(() => {
            const comments = generateComments(newPost.title + ' ' + newPost.description);

            if (comments === null) {
                setError('Content moderation failed. Please revise your video.');
                setIsGenerating(false);
                return;
            }

            const video = postToYouVideo(newPost.title, newPost.description);
            video.comments = comments;
            video.views = Math.floor(Math.random() * 100000);
            video.likes = Math.floor(Math.random() * 5000);
            video.dislikes = Math.floor(Math.random() * 200);

            setNewPost({ content: '', title: '', description: '' });
            setShowCompose(false);
            setIsGenerating(false);
        }, 1000);
    };

    const handleDeleteZ = (postId) => {
        setDeleteConfirm({ type: 'z', id: postId });
    };

    const handleDeleteYouVideo = (videoId) => {
        setDeleteConfirm({ type: 'youvideo', id: videoId });
    };

    const confirmDelete = () => {
        if (deleteConfirm.type === 'z') {
            deleteZPost(deleteConfirm.id);
        } else {
            deleteYouVideo(deleteConfirm.id);
        }
        setDeleteConfirm(null);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black text-white mb-8">Social Media</h1>

            {/* Platform Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('z')}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'z'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-500 hover:text-white'
                        }`}
                >
                    <span className="text-xl">𝕏</span>
                    <span>Z</span>
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">{zFollowers.toLocaleString()}</span>
                </button>
                <button
                    onClick={() => setActiveTab('youvideo')}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'youvideo'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-500 hover:text-white'
                        }`}
                >
                    <span className="text-xl text-red-500">▶️</span>
                    <span>YouVideo</span>
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">{youVideoSubscribers.toLocaleString()}</span>
                </button>
            </div>

            {/* Compose Button */}
            <button
                onClick={() => setShowCompose(true)}
                className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white flex items-center gap-2 hover:opacity-90"
            >
                <Plus className="w-5 h-5" />
                {activeTab === 'z' ? 'New Post' : 'Upload Video'}
            </button>

            {/* Compose Modal */}
            {showCompose && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-slate-900 rounded-2xl p-8 max-w-lg w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {activeTab === 'z' ? 'New Z Post' : 'Upload to YouVideo'}
                        </h2>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-400 text-sm">{error}</span>
                            </div>
                        )}

                        {activeTab === 'z' ? (
                            <textarea
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                placeholder="What's happening at your studio?"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white h-32 resize-none focus:outline-none focus:border-purple-500"
                                maxLength={280}
                            />
                        ) : (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                    placeholder="Video title..."
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                />
                                <textarea
                                    value={newPost.description}
                                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                                    placeholder="Video description..."
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white h-24 resize-none focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        )}

                        <p className="text-slate-600 text-xs mt-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI will generate audience reactions
                        </p>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => { setShowCompose(false); setError(null); }}
                                className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-slate-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={activeTab === 'z' ? handlePostToZ : handlePostToYouVideo}
                                disabled={isGenerating}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Post
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Z Posts */}
            {activeTab === 'z' && (
                <div className="space-y-4">
                    {zPosts.length === 0 ? (
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-12 text-center">
                            <MessageCircle className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500">No posts yet</p>
                            <p className="text-slate-600 text-sm">Share updates about your studio!</p>
                        </div>
                    ) : (
                        zPosts.map(post => (
                            <ZPost key={post.id} post={post} studioName={studio?.name} onDelete={handleDeleteZ} />
                        ))
                    )}
                </div>
            )}

            {/* YouVideo */}
            {activeTab === 'youvideo' && (
                <div className="grid grid-cols-3 gap-6">
                    {youVideoPosts.length === 0 ? (
                        <div className="col-span-3 bg-slate-900/50 border border-white/5 rounded-2xl p-12 text-center">
                            <Video className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500">No videos yet</p>
                            <p className="text-slate-600 text-sm">Upload trailers and dev logs!</p>
                        </div>
                    ) : (
                        youVideoPosts.map(video => (
                            <YouVideoCard key={video.id} video={video} studioName={studio?.name} onDelete={handleDeleteYouVideo} />
                        ))
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <DeleteConfirmModal
                    title={deleteConfirm.type === 'z' ? 'Post' : 'Video'}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}
        </div>
    );
};

export default SocialPanel;
