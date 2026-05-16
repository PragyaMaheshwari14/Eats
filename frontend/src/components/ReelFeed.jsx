import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

/* ───────────── Icons ───────────── */
const HeartIcon = ({ filled }) => filled
  ? <svg width="26" height="26" viewBox="0 0 24 24" fill="#ed4956" stroke="#ed4956" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
  : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>

const BookmarkIcon = ({ filled }) => filled
  ? <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>
  : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>

const CommentIcon  = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
const UpIcon       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
const DownIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
const CloseIcon    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
const SendIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>

/* ─────────────────────────────────────────
   useVisualViewportHeight
   Returns the current visual viewport height in px.
   On Android/Samsung, this shrinks when the keyboard opens.
   Falls back to window.innerHeight on browsers without visualViewport.
───────────────────────────────────────── */
function useVisualViewportHeight() {
  const [vpHeight, setVpHeight] = useState(
    () => window.visualViewport?.height ?? window.innerHeight
  )

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const update = () => setVpHeight(vv.height)
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  return vpHeight
}

/* ───────────── Comment Panel ───────────── */
const CommentPanel = ({ item, onClose, isDesktop, vpHeight }) => {
  const [comments, setComments] = useState([])
  const [text,     setText]     = useState('')
  const [loading,  setLoading]  = useState(true)
  const [posting,  setPosting]  = useState(false)
  const listRef  = useRef(null)
  const inputRef = useRef(null)

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })

  useEffect(() => {
    if (!item) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    axios.get(`${import.meta.env.VITE_API_URL}/api/food/comment/${item._id}`, authHeaders())
      .then(r => setComments(r.data.comments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [item?._id])

  useEffect(() => {
    if (!loading && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [loading, comments.length])

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 150) }, [])

  const handlePost = async () => {
    if (!text.trim() || posting) return
    setPosting(true)
    try {
      const r = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/comment`,
        { foodId: item._id, text: text.trim() },
        authHeaders()
      )
      setComments(prev => [...prev, r.data.comment])
      setText('')
      setTimeout(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight }, 50)
    } catch (e) { console.log(e) }
    finally { setPosting(false) }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePost() }
  }

  const formatTime = (iso) => {
    if (!iso) return ''
    // eslint-disable-next-line react-hooks/purity
    const diff = (Date.now() - new Date(iso)) / 1000
    if (diff < 60)    return 'just now'
    if (diff < 3600)  return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
  }

  const initial     = (name) => (name ?? 'U')[0].toUpperCase()
  const avatarColor = (name) => {
    const colors = ['#f09433','#e6683c','#dc2743','#cc2366','#bc1888','#0095f6','#1dbf73']
    let hash = 0
    for (const c of (name ?? 'U')) hash = c.charCodeAt(0) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  /* ── Mobile sheet height: clamp to visual viewport so keyboard never covers it ── */
  // Bottom nav height (56px) + safe area
  const BOTTOM_NAV = 56
  // Max sheet = 70% of visual viewport; min = enough for header + input (~120px)
  const sheetMaxPx = !isDesktop
    ? Math.max(120, vpHeight - BOTTOM_NAV - 16)   // 16px gap from top of sheet to video
    : undefined

  const sheetStyle = !isDesktop && sheetMaxPx != null
    ? { maxHeight: `${sheetMaxPx}px`, height: `${Math.min(sheetMaxPx, vpHeight * 0.70)}px` }
    : {}

  return (
    <div
      className={`comment-panel ${isDesktop ? 'comment-panel--desktop' : 'comment-panel--sheet'}`}
      style={sheetStyle}
    >
      {/* Header */}
      <div className="comment-panel__header">
        {!isDesktop && <div className="comment-panel__handle" />}
        <span className="comment-panel__title">Comments</span>
        <button className="comment-panel__close" onClick={onClose} aria-label="Close comments">
          <CloseIcon />
        </button>
      </div>

      {/* List */}
      <div className="comment-panel__list" ref={listRef}>
        {loading && <div className="comment-panel__empty">Loading…</div>}
        {!loading && comments.length === 0 && (
          <div className="comment-panel__empty">No comments yet. Be the first!</div>
        )}
        {!loading && comments.map((c, i) => (
          <div key={c._id ?? i} className="comment-item">
            <div className="comment-item__avatar" style={{ background: avatarColor(c.user?.fullName) }}>
              {initial(c.user?.fullName)}
            </div>
            <div className="comment-item__body">
              <div className="comment-item__meta">
                <span className="comment-item__name">{c.user?.fullName ?? 'User'}</span>
                <span className="comment-item__time">{formatTime(c.createdAt)}</span>
              </div>
              <p className="comment-item__text">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="comment-panel__input-row">
        <input
          ref={inputRef}
          className="comment-panel__input"
          placeholder="What do you think?"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          maxLength={300}
        />
        <button
          className="comment-panel__send"
          onClick={handlePost}
          disabled={!text.trim() || posting}
          aria-label="Post comment"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}

/* ───────────── ReelFeed ───────────── */
const ReelFeed = ({
  items = [],
  onLike,
  onSave,
  emptyMessage = 'No videos yet.',
  initialLikedIds = new Set(),
  initialSavedIds = new Set(),
}) => {
  const videoRefs      = useRef(new Map())
  const feedRef        = useRef(null)
  const currentIdxRef  = useRef(0)
  const isScrollingRef = useRef(false)
  const wheelAccRef    = useRef(0)

  const itemsRef  = useRef(items)
  const onSaveRef = useRef(onSave)
  const onLikeRef = useRef(onLike)
  useEffect(() => { itemsRef.current  = items  }, [items])
  useEffect(() => { onSaveRef.current = onSave }, [onSave])
  useEffect(() => { onLikeRef.current = onLike }, [onLike])

  const [activeIdx,   setActiveIdx]   = useState(0)
  const [likedIds,    setLikedIds]    = useState(new Set())
  const [savedIds,    setSavedIds]    = useState(new Set())
  const [popHeart,    setPopHeart]    = useState(null)
  const [popSave,     setPopSave]     = useState(null)
  const [commentItem, setCommentItem] = useState(null)
  const [isDesktop,   setIsDesktop]   = useState(window.innerWidth >= 1024)

  // Live visual-viewport height — shrinks when keyboard opens on Android
  const vpHeight = useVisualViewportHeight()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialLikedIds.size > 0) setLikedIds(new Set(initialLikedIds))
  }, [initialLikedIds])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialSavedIds.size > 0) setSavedIds(new Set(initialSavedIds))
  }, [initialSavedIds])

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ── Snap ── */
  const scrollToIndex = useCallback((index) => {
    const feed = feedRef.current
    if (!feed) return
    const reels = feed.querySelectorAll('.reel')
    if (index < 0 || index >= reels.length) return
    isScrollingRef.current = true
    reels[index].scrollIntoView({ behavior: 'smooth', block: 'start' })
    currentIdxRef.current = index
    setActiveIdx(index)
    setTimeout(() => { isScrollingRef.current = false }, 650)
  }, [])

  const scrollPrev = useCallback(() => scrollToIndex(Math.max(0, currentIdxRef.current - 1)), [scrollToIndex])
  const scrollNext = useCallback(() => scrollToIndex(Math.min(itemsRef.current.length - 1, currentIdxRef.current + 1)), [scrollToIndex])

  /* ── Wheel ── */
  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return
    const onWheel = (e) => {
      if (window.innerWidth < 1024) return
      e.preventDefault()
      wheelAccRef.current += e.deltaY
      if (Math.abs(wheelAccRef.current) >= 40) {
        if (!isScrollingRef.current) wheelAccRef.current > 0 ? scrollNext() : scrollPrev()
        wheelAccRef.current = 0
      }
    }
    feed.addEventListener('wheel', onWheel, { passive: false })
    return () => feed.removeEventListener('wheel', onWheel)
  }, [items, scrollNext, scrollPrev])

  /* ── Keyboard nav ── */
  useEffect(() => {
    const onKey = (e) => {
      if (window.innerWidth < 1024) return
      if (e.key === 'Escape') { setCommentItem(null); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); scrollNext() }
      if (e.key === 'ArrowUp')   { e.preventDefault(); scrollPrev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scrollNext, scrollPrev])

  /* ── Autoplay ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        const video = entry.target
        if (!(video instanceof HTMLVideoElement)) return
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) video.play().catch(() => {})
        else video.pause()
      }),
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )
    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  /* ── Track active index ── */
  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return
    const onScroll = () => {
      feed.querySelectorAll('.reel').forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        if (rect.top >= -10 && rect.top < window.innerHeight / 2) {
          currentIdxRef.current = i
          setActiveIdx(i)
        }
      })
    }
    feed.addEventListener('scroll', onScroll, { passive: true })
    return () => feed.removeEventListener('scroll', onScroll)
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }

  /* ── Like ── */
  const handleLike = useCallback((item) => {
    const isLiked = likedIds.has(item._id)
    setLikedIds(prev => { const n = new Set(prev); isLiked ? n.delete(item._id) : n.add(item._id); return n })
    if (!isLiked) { setPopHeart(item._id); setTimeout(() => setPopHeart(null), 400) }
    onLikeRef.current?.(item)
  }, [likedIds])

  /* ── Save ── */
  const handleSave = useCallback((item) => {
    const isSaved = savedIds.has(item._id)
    setSavedIds(prev => { const n = new Set(prev); isSaved ? n.delete(item._id) : n.add(item._id); return n })
    if (!isSaved) { setPopSave(item._id); setTimeout(() => setPopSave(null), 400) }
    onSaveRef.current?.(item)
  }, [savedIds])

  /* ── Comment ── */
  const handleComment = useCallback((item) => {
    setCommentItem(prev => prev?._id === item._id ? null : item)
  }, [])

  const handleDesktopLike    = () => { const i = itemsRef.current[currentIdxRef.current]; if (i) handleLike(i) }
  const handleDesktopSave    = () => { const i = itemsRef.current[currentIdxRef.current]; if (i) handleSave(i) }
  const handleDesktopComment = () => { const i = itemsRef.current[currentIdxRef.current]; if (i) handleComment(i) }

  const activeItem           = items[activeIdx] ?? null
  const commentOpen          = !!commentItem
  const desktopCommentActive = isDesktop && commentOpen && commentItem?._id === activeItem?._id

  return (
    <div className={`reels-page${desktopCommentActive ? ' reels-page--comments-open' : ''}`}>

      {/* ══ Feed ══ */}
      <div className="reels-feed" ref={feedRef} role="list">
        {items.length === 0 && <div className="empty-state"><p>{emptyMessage}</p></div>}

        {items.map((item) => {
          const isLiked  = likedIds.has(item._id)
          const isSaved  = savedIds.has(item._id)
          const heartPop = popHeart === item._id
          const savePop  = popSave  === item._id

          return (
            <section key={item._id} className="reel" role="listitem">
              <video
                ref={setVideoRef(item._id)}
                className="reel-video"
                src={item.video}
                muted playsInline loop preload="metadata"
              />
              <div className="reel-overlay">
                <div className="reel-overlay-gradient" aria-hidden="true" />

                {/* Mobile actions */}
                <div className="reel-actions">
                  <div className="reel-action-group">
                    <button
                      className={`reel-action${heartPop ? ' reel-action--pop' : ''}`}
                      onClick={() => handleLike(item)}
                      aria-label={isLiked ? 'Unlike' : 'Like'}
                      style={{ color: isLiked ? '#ed4956' : '#fff' }}
                    >
                      <HeartIcon filled={isLiked} />
                    </button>
                    <span className="reel-action__count">{item.likeCount ?? 0}</span>
                  </div>

                  <div className="reel-action-group">
                    <button
                      className="reel-action"
                      onClick={() => handleComment(item)}
                      aria-label="Comments"
                      style={{ color: commentItem?._id === item._id ? 'var(--color-accent)' : '#fff' }}
                    >
                      <CommentIcon />
                    </button>
                    <span className="reel-action__count">{item.commentCount ?? 0}</span>
                  </div>

                  <div className="reel-action-group">
                    <button
                      className={`reel-action${savePop ? ' reel-action--pop' : ''}`}
                      onClick={() => handleSave(item)}
                      aria-label={isSaved ? 'Unsave' : 'Save'}
                      style={{ color: '#fff' }}
                    >
                      <BookmarkIcon filled={isSaved} />
                    </button>
                    <span className="reel-action__count">{item.savesCount ?? 0}</span>
                  </div>
                </div>

                {/* Caption */}
                <div className="reel-content">
                  {item.foodPartner && (
                    <div className="reel-author">
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#f09433,#bc1888)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, flexShrink: 0, border: '2px solid rgba(255,255,255,.5)'
                      }}>🍔</div>
                      <span className="reel-username">Food Partner</span>
                    </div>
                  )}
                  {item.description && (
                    <p className="reel-description" title={item.description}>{item.description}</p>
                  )}
                  {item.foodPartner && (
                    <Link className="reel-btn" to={"/food-partner/" + item.foodPartner}>Visit store →</Link>
                  )}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* ══ Desktop actions ══ */}
      {items.length > 0 && (
        <div className="reel-actions-desktop">
          <button
            className={`reel-action-desktop${activeItem && likedIds.has(activeItem._id) ? ' reel-action-desktop--liked' : ''}${activeItem && popHeart === activeItem._id ? ' reel-action-desktop--pop' : ''}`}
            onClick={handleDesktopLike} aria-label="Like"
          >
            <HeartIcon filled={activeItem ? likedIds.has(activeItem._id) : false} />
            <span className="reel-action-desktop__count">{activeItem?.likeCount ?? 0}</span>
          </button>

          <button
            className={`reel-action-desktop${desktopCommentActive ? ' reel-action-desktop--active' : ''}`}
            onClick={handleDesktopComment} aria-label="Comments"
          >
            <CommentIcon />
            <span className="reel-action-desktop__count">{activeItem?.commentCount ?? 0}</span>
          </button>

          <button
            className={`reel-action-desktop${activeItem && savedIds.has(activeItem._id) ? ' reel-action-desktop--saved' : ''}${activeItem && popSave === activeItem._id ? ' reel-action-desktop--pop' : ''}`}
            onClick={handleDesktopSave} aria-label="Save"
          >
            <BookmarkIcon filled={activeItem ? savedIds.has(activeItem._id) : false} />
            <span className="reel-action-desktop__count">{activeItem?.savesCount ?? 0}</span>
          </button>
        </div>
      )}

      {/* ══ Desktop nav arrows ══ */}
      {items.length > 0 && (
        <div className="reel-nav-arrows">
          <button className="reel-nav-btn" onClick={scrollPrev} aria-label="Previous reel"><UpIcon /></button>
          <button className="reel-nav-btn" onClick={scrollNext} aria-label="Next reel"><DownIcon /></button>
        </div>
      )}

      {/* ══ Desktop comment panel ══ */}
      {isDesktop && commentOpen && (
        <CommentPanel
          item={commentItem}
          onClose={() => setCommentItem(null)}
          isDesktop={true}
          vpHeight={vpHeight}
        />
      )}

      {/* ══ Mobile comment bottom sheet ══ */}
      {!isDesktop && commentOpen && (
        <>
          <div className="comment-backdrop" onClick={() => setCommentItem(null)} />
          <CommentPanel
            item={commentItem}
            onClose={() => setCommentItem(null)}
            isDesktop={false}
            vpHeight={vpHeight}
          />
        </>
      )}
    </div>
  )
}

export default ReelFeed