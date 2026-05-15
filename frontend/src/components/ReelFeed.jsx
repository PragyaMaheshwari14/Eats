import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

const HeartIcon    = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
const CommentIcon  = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
const BookmarkIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>
const UpIcon       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
const DownIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>

const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.' }) => {
  const videoRefs      = useRef(new Map())
  const feedRef        = useRef(null)
  const currentIdxRef  = useRef(0)
  const isScrollingRef = useRef(false)   // debounce flag — prevent rapid multi-skip
  const wheelAccRef    = useRef(0)       // accumulate trackpad delta before firing

  // Always-fresh refs — prevents stale closures on desktop buttons
  const itemsRef  = useRef(items)
  const onSaveRef = useRef(onSave)
  const onLikeRef = useRef(onLike)
  useEffect(() => { itemsRef.current  = items  }, [items])
  useEffect(() => { onSaveRef.current = onSave }, [onSave])
  useEffect(() => { onLikeRef.current = onLike }, [onLike])

  const [activeIdx, setActiveIdx] = useState(0)

  /* ── Snap to a specific index ── */
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

    // unlock after animation (~600ms)
    setTimeout(() => { isScrollingRef.current = false }, 650)
  }, [])

  const scrollPrev = useCallback(() => {
    scrollToIndex(Math.max(0, currentIdxRef.current - 1))
  }, [scrollToIndex])

  const scrollNext = useCallback(() => {
    scrollToIndex(Math.min(itemsRef.current.length - 1, currentIdxRef.current + 1))
  }, [scrollToIndex])

  /* ── Intercept wheel / trackpad on desktop ── */
  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return

    const isDesktop = () => window.innerWidth >= 1024

    const onWheel = (e) => {
      if (!isDesktop()) return          // let native scroll handle mobile/tablet

      e.preventDefault()               // stop the feed from free-scrolling

      // Accumulate delta — trackpads send many small events; mice send one big one
      wheelAccRef.current += e.deltaY

      // Fire once the accumulated delta crosses threshold
      const THRESHOLD = 40
      if (Math.abs(wheelAccRef.current) >= THRESHOLD) {
        if (!isScrollingRef.current) {
          if (wheelAccRef.current > 0) {
            scrollNext()
          } else {
            scrollPrev()
          }
        }
        wheelAccRef.current = 0       // reset accumulator after firing
      }
    }

    // { passive: false } required to call preventDefault
    feed.addEventListener('wheel', onWheel, { passive: false })
    return () => feed.removeEventListener('wheel', onWheel)
  }, [items, scrollNext, scrollPrev])

  /* ── Keyboard arrow support ── */
  useEffect(() => {
    const onKey = (e) => {
      if (window.innerWidth < 1024) return
      if (e.key === 'ArrowDown') { e.preventDefault(); scrollNext() }
      if (e.key === 'ArrowUp')   { e.preventDefault(); scrollPrev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scrollNext, scrollPrev])

  /* ── Autoplay via IntersectionObserver ── */
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

  /* ── Track active index via scroll (for mobile + fallback) ── */
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

  // Desktop action handlers — always read from refs, never stale
  const handleDesktopLike = () => {
    const item = itemsRef.current[currentIdxRef.current]
    if (item && onLikeRef.current) onLikeRef.current(item)
  }
  const handleDesktopSave = () => {
    const item = itemsRef.current[currentIdxRef.current]
    if (item && onSaveRef.current) onSaveRef.current(item)
  }

  const activeItem = items[activeIdx] ?? null

  return (
    <div className="reels-page">

      {/* ══ Video feed column ══ */}
      <div className="reels-feed" ref={feedRef} role="list">
        {items.length === 0 && (
          <div className="empty-state"><p>{emptyMessage}</p></div>
        )}

        {items.map((item) => (
          <section key={item._id} className="reel" role="listitem">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              muted playsInline loop preload="metadata"
            />

            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />

              {/* Mobile: actions overlaid on video */}
              <div className="reel-actions">
                <div className="reel-action-group">
                  <button className="reel-action" onClick={() => onLike?.(item)} aria-label="Like">
                    <HeartIcon />
                  </button>
                  <span className="reel-action__count">{item.likeCount ?? item.likesCount ?? item.likes ?? 0}</span>
                </div>
                <div className="reel-action-group">
                  <button className="reel-action" aria-label="Comments">
                    <CommentIcon />
                  </button>
                  <span className="reel-action__count">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</span>
                </div>
                <div className="reel-action-group">
                  <button className="reel-action" onClick={() => onSave?.(item)} aria-label="Save">
                    <BookmarkIcon />
                  </button>
                  <span className="reel-action__count">{item.savesCount ?? item.bookmarks ?? item.saves ?? 0}</span>
                </div>
              </div>

              {/* Bottom caption */}
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
        ))}
      </div>

      {/* ══ Desktop: action buttons outside the video ══ */}
      {items.length > 0 && (
        <div className="reel-actions-desktop">
          <button className="reel-action-desktop" onClick={handleDesktopLike} aria-label="Like">
            <HeartIcon />
            <span className="reel-action-desktop__count">
              {activeItem?.likeCount ?? activeItem?.likesCount ?? activeItem?.likes ?? 0}
            </span>
          </button>

          <button className="reel-action-desktop" aria-label="Comments">
            <CommentIcon />
            <span className="reel-action-desktop__count">
              {activeItem?.commentsCount ?? (Array.isArray(activeItem?.comments) ? activeItem.comments.length : 0)}
            </span>
          </button>

          <button className="reel-action-desktop" onClick={handleDesktopSave} aria-label="Save">
            <BookmarkIcon />
            <span className="reel-action-desktop__count">
              {activeItem?.savesCount ?? activeItem?.bookmarks ?? activeItem?.saves ?? 0}
            </span>
          </button>
        </div>
      )}

      {/* ══ Desktop: up/down nav arrows ══ */}
      {items.length > 0 && (
        <div className="reel-nav-arrows">
          <button className="reel-nav-btn" onClick={scrollPrev} aria-label="Previous reel">
            <UpIcon />
          </button>
          <button className="reel-nav-btn" onClick={scrollNext} aria-label="Next reel">
            <DownIcon />
          </button>
        </div>
      )}

    </div>
  )
}

export default ReelFeed