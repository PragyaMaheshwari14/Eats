import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

/* ── Icons ── */
// Heart: filled (liked) vs outline (not liked)
const HeartIcon = ({ filled }) => filled
  ? <svg width="26" height="26" viewBox="0 0 24 24" fill="#ed4956" stroke="#ed4956" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
  : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>

// Bookmark: filled (saved) vs outline (not saved)
const BookmarkIcon = ({ filled }) => filled
  ? <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>
  : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>

const CommentIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
const UpIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
const DownIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>

const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.' }) => {
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

  const [activeIdx, setActiveIdx] = useState(0)

  // Track liked/saved per item id
  const [likedIds,  setLikedIds]  = useState(new Set())
  const [savedIds,  setSavedIds]  = useState(new Set())
  // Track which id is currently animating (for pop effect)
  const [popHeart,  setPopHeart]  = useState(null)
  const [popSave,   setPopSave]   = useState(null)

  /* ── Snap to index ── */
  const scrollToIndex = useCallback((index) => {
    const feed  = feedRef.current
    if (!feed) return
    const reels = feed.querySelectorAll('.reel')
    const total = reels.length
    if (index < 0 || index >= total) return
    isScrollingRef.current = true
    reels[index].scrollIntoView({ behavior: 'smooth', block: 'start' })
    currentIdxRef.current = index
    setActiveIdx(index)
    setTimeout(() => { isScrollingRef.current = false }, 650)
  }, [])

  const scrollPrev = useCallback(() => scrollToIndex(Math.max(0, currentIdxRef.current - 1)), [scrollToIndex])
  const scrollNext = useCallback(() => scrollToIndex(Math.min(itemsRef.current.length - 1, currentIdxRef.current + 1)), [scrollToIndex])

  /* ── Wheel intercept ── */
  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return
    const isDesktop = () => window.innerWidth >= 1024
    const onWheel = (e) => {
      if (!isDesktop()) return
      e.preventDefault()
      wheelAccRef.current += e.deltaY
      if (Math.abs(wheelAccRef.current) >= 40) {
        if (!isScrollingRef.current) {
          wheelAccRef.current > 0 ? scrollNext() : scrollPrev()
        }
        wheelAccRef.current = 0
      }
    }
    feed.addEventListener('wheel', onWheel, { passive: false })
    return () => feed.removeEventListener('wheel', onWheel)
  }, [items, scrollNext, scrollPrev])

  /* ── Keyboard ── */
  useEffect(() => {
    const onKey = (e) => {
      if (window.innerWidth < 1024) return
      if (e.key === 'ArrowDown') { e.preventDefault(); scrollNext() }
      if (e.key === 'ArrowUp')   { e.preventDefault(); scrollPrev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scrollNext, scrollPrev])

  /* ── Autoplay ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )
    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  /* ── Track active index via scroll ── */
  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return
    const onScroll = () => {
      const reels = feed.querySelectorAll('.reel')
      reels.forEach((el, i) => {
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

  /* ── Like handler — toggles red heart + pop animation ── */
  const handleLike = useCallback((item) => {
    const isLiked = likedIds.has(item._id)
    setLikedIds(prev => {
      const next = new Set(prev)
      isLiked ? next.delete(item._id) : next.add(item._id)
      return next
    })
    // Trigger pop animation only when liking (not unliking)
    if (!isLiked) {
      setPopHeart(item._id)
      setTimeout(() => setPopHeart(null), 400)
    }
    onLikeRef.current?.(item)
  }, [likedIds])

  /* ── Save handler — toggles filled bookmark ── */
  const handleSave = useCallback((item) => {
    const isSaved = savedIds.has(item._id)
    setSavedIds(prev => {
      const next = new Set(prev)
      isSaved ? next.delete(item._id) : next.add(item._id)
      return next
    })
    // Pop animation when saving
    if (!isSaved) {
      setPopSave(item._id)
      setTimeout(() => setPopSave(null), 400)
    }
    onSaveRef.current?.(item)
  }, [savedIds])

  /* ── Desktop handlers — read from current index ── */
  const handleDesktopLike = () => {
    const item = itemsRef.current[currentIdxRef.current]
    if (item) handleLike(item)
  }
  const handleDesktopSave = () => {
    const item = itemsRef.current[currentIdxRef.current]
    if (item) handleSave(item)
  }

  const activeItem = items[activeIdx] ?? null

  return (
    <div className="reels-page">

      {/* ══ Video feed ══ */}
      <div className="reels-feed" ref={feedRef} role="list">
        {items.length === 0 && (
          <div className="empty-state"><p>{emptyMessage}</p></div>
        )}

        {items.map((item) => {
          const isLiked = likedIds.has(item._id)
          const isSaved = savedIds.has(item._id)
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

                {/* Mobile action buttons */}
                <div className="reel-actions">
                  {/* Like */}
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

                  {/* Comment */}
                  <div className="reel-action-group">
                    <button className="reel-action" aria-label="Comments">
                      <CommentIcon />
                    </button>
                    <span className="reel-action__count">
                      {item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}
                    </span>
                  </div>

                  {/* Save */}
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
                    <Link className="reel-btn" to={"/food-partner/" + item.foodPartner}>
                      Visit store →
                    </Link>
                  )}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* ══ Desktop: action column ══ */}
      {items.length > 0 && (
        <div className="reel-actions-desktop">
          {/* Like */}
          <button
            className={`reel-action-desktop${activeItem && likedIds.has(activeItem._id) ? ' reel-action-desktop--liked' : ''}${activeItem && popHeart === activeItem._id ? ' reel-action-desktop--pop' : ''}`}
            onClick={handleDesktopLike}
            aria-label={activeItem && likedIds.has(activeItem._id) ? 'Unlike' : 'Like'}
          >
            <HeartIcon filled={activeItem ? likedIds.has(activeItem._id) : false} />
            <span className="reel-action-desktop__count">
              {activeItem?.likeCount ?? 0}
            </span>
          </button>

          {/* Comment */}
          <button className="reel-action-desktop" aria-label="Comments">
            <CommentIcon />
            <span className="reel-action-desktop__count">
              {activeItem?.commentsCount ?? (Array.isArray(activeItem?.comments) ? activeItem.comments.length : 0)}
            </span>
          </button>

          {/* Save */}
          <button
            className={`reel-action-desktop${activeItem && savedIds.has(activeItem._id) ? ' reel-action-desktop--saved' : ''}${activeItem && popSave === activeItem._id ? ' reel-action-desktop--pop' : ''}`}
            onClick={handleDesktopSave}
            aria-label={activeItem && savedIds.has(activeItem._id) ? 'Unsave' : 'Save'}
          >
            <BookmarkIcon filled={activeItem ? savedIds.has(activeItem._id) : false} />
            <span className="reel-action-desktop__count">
              {activeItem?.savesCount ?? 0}
            </span>
          </button>
        </div>
      )}

      {/* ══ Desktop: nav arrows ══ */}
      {items.length > 0 && (
        <div className="reel-nav-arrows">
          <button className="reel-nav-btn" onClick={scrollPrev} aria-label="Previous reel"><UpIcon /></button>
          <button className="reel-nav-btn" onClick={scrollNext} aria-label="Next reel"><DownIcon /></button>
        </div>
      )}

    </div>
  )
}

export default ReelFeed