(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,24511,e=>{"use strict";e.i(47167);var t,o=e.i(43476),s=e.i(71645);let a=(0,s.createContext)({});var n=e.i(48070);let i=(0,s.createContext)({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"}),r=(0,s.createContext)({});var l=e.i(87576),u=e.i(32525);function d(e){return Array.isArray(e)?e.join(" "):e}var c=e.i(83411),h=e.i(30789),g=e.i(44947);let p=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function y(e,t,o){for(let s in t)(0,c.isMotionValue)(t[s])||(0,h.isForcedMotionValue)(s,o)||(e[s]=t[s])}var m=e.i(81261),f=e.i(99951);let w=()=>({...p(),attrs:{}}),b=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function v(e){return e.startsWith("while")||e.startsWith("drag")&&"draggable"!==e||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||b.has(e)}let k=e=>!v(e);try{t=(()=>{let e=Error("Cannot find module '@emotion/is-prop-valid'");throw e.code="MODULE_NOT_FOUND",e})().default,"function"==typeof t&&(k=e=>e.startsWith("on")?!v(e):t(e))}catch{}var x=e.i(44966),A=e.i(84049),A=A,I=e.i(85983),T=e.i(86579);let G=(0,s.createContext)(null),B=e=>(t,o)=>{let a,n=(0,s.useContext)(r),i=(0,s.useContext)(G),u=()=>(function({scrapeMotionValuesFromProps:e,createRenderState:t},o,s,a){return{latestValues:function(e,t,o,s){let a={},n=s(e,{});for(let e in n){var i;a[e]=(i=n[e],(0,c.isMotionValue)(i)?i.get():i)}let{initial:r,animate:u}=e,d=(0,l.isControllingVariants)(e),h=(0,l.isVariantNode)(e);t&&h&&!d&&!1!==e.inherit&&(void 0===r&&(r=t.initial),void 0===u&&(u=t.animate));let g=!!o&&!1===o.initial,p=(g=g||!1===r)?u:r;if(p&&"boolean"!=typeof p&&!(0,I.isAnimationControls)(p)){let t=Array.isArray(p)?p:[p];for(let o=0;o<t.length;o++){let s=(0,T.resolveVariantFromProps)(e,t[o]);if(s){let{transitionEnd:e,transition:t,...o}=s;for(let e in o){let t=o[e];if(Array.isArray(t)){let e=g?t.length-1:0;t=t[e]}null!==t&&(a[e]=t)}for(let t in e)a[t]=e[t]}}}return a}(o,s,a,e),renderState:t()}})(e,t,n,i);return o?u():(null===(a=(0,s.useRef)(null)).current&&(a.current=u()),a.current)},W=B({scrapeMotionValuesFromProps:A.scrapeMotionValuesFromProps,createRenderState:p});var M=e.i(67926),M=M;let C=B({scrapeMotionValuesFromProps:M.scrapeMotionValuesFromProps,createRenderState:w});var P=e.i(76948),S=e.i(13565);let Y=Symbol.for("motionComponentSymbol");var N=e.i(35043);let j=(0,s.createContext)({}),F="u">typeof window?s.useLayoutEffect:s.useEffect;function H(e,{forwardMotionProps:t=!1,type:h}={},b,A){b&&(0,S.loadFeatures)(b);let I=h?"svg"===h:(0,x.isSVGComponent)(e),T=I?C:W;function B(h,b){var B;let W,M,C,S={...(0,s.useContext)(i),...h,layoutId:function({layoutId:e}){let t=(0,s.useContext)(a).id;return t&&void 0!==e?t+"-"+e:e}(h)},{isStatic:Y}=S,H=function(e){let{initial:t,animate:o}=function(e,t){if((0,l.isControllingVariants)(e)){let{initial:t,animate:o}=e;return{initial:!1===t||(0,u.isVariantLabel)(t)?t:void 0,animate:(0,u.isVariantLabel)(o)?o:void 0}}return!1!==e.inherit?t:{}}(e,(0,s.useContext)(r));return(0,s.useMemo)(()=>({initial:t,animate:o}),[d(t),d(o)])}(h),E=T(h,Y);if(!Y&&"u">typeof window){(0,s.useContext)(n.LazyContext).strict;let t=function(e){let{drag:t,layout:o}=(0,P.getInitializedFeatureDefinitions)();if(!t&&!o)return{};let s={...t,...o};return{MeasureLayout:t?.isEnabled(e)||o?.isEnabled(e)?s.MeasureLayout:void 0,ProjectionNode:s.ProjectionNode}}(S);W=t.MeasureLayout,H.visualElement=function(e,t,o,a,l,u){let{visualElement:d}=(0,s.useContext)(r),c=(0,s.useContext)(n.LazyContext),h=(0,s.useContext)(G),g=(0,s.useContext)(i),p=g.reducedMotion,y=g.skipAnimations,m=(0,s.useRef)(null),f=(0,s.useRef)(!1);a=a||c.renderer,!m.current&&a&&(m.current=a(e,{visualState:t,parent:d,props:o,presenceContext:h,blockInitialAnimation:!!h&&!1===h.initial,reducedMotionConfig:p,skipAnimations:y,isSVG:u}),f.current&&m.current&&(m.current.manuallyAnimateOnMount=!0));let w=m.current,b=(0,s.useContext)(j);w&&!w.projection&&l&&("html"===w.type||"svg"===w.type)&&function(e,t,o,s){var a;let{layoutId:n,layout:i,drag:r,dragConstraints:l,layoutScroll:u,layoutRoot:d,layoutAnchor:c,layoutCrossfade:h}=t;e.projection=new o(e.latestValues,t["data-framer-portal-id"]?void 0:function e(t){if(t)return!1!==t.options.allowProjection?t.projection:e(t.parent)}(e.parent)),e.projection.setOptions({layoutId:n,layout:i,alwaysMeasureLayout:!!r||l&&(a=l)&&"object"==typeof a&&Object.prototype.hasOwnProperty.call(a,"current"),visualElement:e,animationType:"string"==typeof i?i:"both",initialPromotionConfig:s,crossfade:h,layoutScroll:u,layoutRoot:d,layoutAnchor:c})}(m.current,o,l,b);let v=(0,s.useRef)(!1);(0,s.useInsertionEffect)(()=>{w&&v.current&&w.update(o,h)});let k=o[N.optimizedAppearDataAttribute],x=(0,s.useRef)(!!k&&"u">typeof window&&!window.MotionHandoffIsComplete?.(k)&&window.MotionHasOptimisedAnimation?.(k));return F(()=>{f.current=!0,w&&(v.current=!0,window.MotionIsMounted=!0,w.updateFeatures(),w.scheduleRenderMicrotask(),x.current&&w.animationState&&w.animationState.animateChanges())}),(0,s.useEffect)(()=>{w&&(!x.current&&w.animationState&&w.animationState.animateChanges(),x.current&&(queueMicrotask(()=>{window.MotionHandoffMarkAsComplete?.(k)}),x.current=!1),w.enteringChildren=void 0)}),w}(e,E,S,A,t.ProjectionNode,I)}return(0,o.jsxs)(r.Provider,{value:H,children:[W&&H.visualElement?(0,o.jsx)(W,{visualElement:H.visualElement,...S}):null,function(e,t,o,{latestValues:a},n,i=!1,r){let l=(r??(0,x.isSVGComponent)(e)?function(e,t,o,a){let n=(0,s.useMemo)(()=>{let o=w();return(0,m.buildSVGAttrs)(o,t,(0,f.isSVGTag)(a),e.transformTemplate,e.style),{...o.attrs,style:{...o.style}}},[t]);if(e.style){let t={};y(t,e.style,e),n.style={...t,...n.style}}return n}:function(e,t){let o,a,n={},i=(o=e.style||{},y(a={},o,e),Object.assign(a,function({transformTemplate:e},t){return(0,s.useMemo)(()=>{let o=p();return(0,g.buildHTMLStyles)(o,t,e),Object.assign({},o.vars,o.style)},[t])}(e,t)),a);return e.drag&&!1!==e.dragListener&&(n.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=!0===e.drag?"none":`pan-${"x"===e.drag?"y":"x"}`),void 0===e.tabIndex&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=i,n})(t,a,n,e),u=function(e,t,o){let s={};for(let a in e)("values"!==a||"object"!=typeof e.values)&&!(0,c.isMotionValue)(e[a])&&(k(a)||!0===o&&v(a)||!t&&!v(a)||e.draggable&&a.startsWith("onDrag"))&&(s[a]=e[a]);return s}(t,"string"==typeof e,i),d=e!==s.Fragment?{...u,...l,ref:o}:{},{children:h}=t,b=(0,s.useMemo)(()=>(0,c.isMotionValue)(h)?h.get():h,[h]);return(0,s.createElement)(e,{...d,children:b})}(e,h,(B=H.visualElement,M=(0,s.useRef)(b),(0,s.useInsertionEffect)(()=>{M.current=b}),C=(0,s.useRef)(null),(0,s.useCallback)(e=>{e&&E.onMount?.(e);let t=M.current;if("function"==typeof t)if(e){let o=t(e);"function"==typeof o&&(C.current=o)}else C.current?(C.current(),C.current=null):t(e);else t&&(t.current=e);B&&(e?B.mount(e):B.unmount())},[B])),E,Y,t,I)]})}B.displayName=`motion.${"string"==typeof e?e:`create(${e.displayName??e.name??""})`}`;let M=(0,s.forwardRef)(B);return M[Y]=e,M}let E=function(){if("u"<typeof Proxy)return H;let e=new Map,t=(e,t)=>H(e,t,void 0,void 0);return new Proxy((e,o)=>t(e,o),{get:(o,s)=>"create"===s?t:(e.has(s)||e.set(s,H(s,void 0,void 0,void 0)),e.get(s))})}();e.s(["m",0,E],24511)},72520,e=>{"use strict";let t=(0,e.i(75254).default)("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);e.s(["ArrowRight",0,t],72520)},87316,e=>{"use strict";let t=(0,e.i(75254).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["Calendar",0,t],87316)},3116,e=>{"use strict";let t=(0,e.i(75254).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["Clock",0,t],3116)},60380,e=>{"use strict";var t=e.i(43476),o=e.i(71645),s=e.i(22016),a=e.i(57688);let n=[{slug:"how-to-set-up-google-business-profile-india-2026",title:"How to Set Up and Optimise Your Google Business Profile (2026 Guide)",date:"2026-03-28",author:"Shivani Nile",coverImage:"/images/blog/GMB.webp",ctaHeadline:"Think your Google profile is costing you customers?",ctaBody:"Most local business profiles are missing the easiest fixes. WhatsApp us for a free audit.",ctaButton:"WhatsApp us for a free audit",excerpt:"Your Google Business Profile is the first thing customers see when they search for your business. Here's how to set it up right — and the mistakes most Indian businesses make.",category:"Google Business Profile",readingTime:"8 min read",metaDescription:"Complete 2026 guide to setting up and optimising your Google Business Profile for Indian businesses. Get found in local searches and start getting more enquiries.",keywords:["google business profile setup india","google business profile optimisation","GBP for local business","google my business india 2026"],content:`## Why Your Google Business Profile Matters More Than Your Website

Let's be honest — when was the last time you Googled a restaurant, clinic, or salon and actually clicked through to their website? You probably just looked at the Google listing, checked the reviews, maybe glanced at the photos, and called them directly.

That's exactly what your customers do.

Your Google Business Profile (GBP) is often the **first and only** impression a potential customer gets of your business. If it's incomplete, has bad photos, no reviews, or wrong information — they'll scroll to the next result and call your competitor instead.

> "Your Google Business Profile is the digital front door to your local business. If it's locked or looks neglected, customers simply won't enter."

And the worst part? Most Indian small business owners don't even know their GBP profile exists, or they set it up once three years ago and forgot about it.

## Step 1: Claim or Create Your Google Business Profile

If your business has been around for a while, there's a good chance Google has already created a basic listing for you. Here's what to do:

1. Go to [business.google.com](https://business.google.com)
2. Sign in with a Google account (preferably one you'll use long-term — not your personal Gmail if possible)
3. Search for your business name
4. If it exists, click **"Claim this business"** and follow the verification process
5. If it doesn't exist, click **"Add your business"** and fill in the details

**Pro tip:** Google usually verifies via postcard (yes, actual postal mail), phone call, or email. The postcard method takes 5-14 days in India, so don't panic if it's slow. Some categories now offer instant verification via phone.

## Step 2: Fill Out Every Single Field

This is where 90% of businesses mess up. They fill in the name and phone number and think they're done. Google rewards **completeness**. The more you fill out, the higher you rank in local searches.

Here's what you need to complete:

### Business Name
Use your actual business name. Don't stuff keywords in here — Google will penalise you. "Sharma Dental Clinic" is correct. "Sharma Dental Clinic Best Dentist in Jaipur Teeth Whitening" will get your profile suspended.

### Category
Choose your **primary category** carefully — this is the single biggest ranking factor. Be specific: "Dental Clinic" beats "Health and Wellness." You can add secondary categories too.

### Address
If you serve customers at your location, add your full address. If you're a service-area business (like a plumber or delivery service), you can hide your address and show your service area instead.

### Phone Number
Use a number you actually answer. Obvious, but you'd be surprised how many businesses list a number that goes to voicemail or a switched-off phone.

### Website
Link to your website if you have one. If you don't, that's okay — your GBP will still work.

### Hours
Keep these accurate. Nothing annoys a customer more than showing up to a "open" business that's actually closed. Update your hours for holidays too.

### Business Description
You get 750 characters. Use them wisely. Write what you do, who you serve, and what makes you different. Write for humans, not algorithms. Include your city name naturally.

**Example:** "We're a family dental clinic in Jaipur serving patients for over 15 years. From routine cleanups to cosmetic dentistry, we handle everything with care. Walk-ins welcome, and we're open on Sundays."

## Step 3: Add Photos (This Is Huge)

![Google Business Profile Photos Example](/images/blog/GMB.webp)

Businesses with photos get **42% more direction requests** and **35% more clicks** to their websites, according to Google's own published data. Yet most Indian businesses have either zero photos or blurry ones taken on a phone in 2019.

Here's what to add:

- **Exterior photo:** So people can recognise your shop/clinic/office from the street
- **Interior photos:** Show that your space is clean, modern, and welcoming
- **Team photos:** People trust faces. Show your staff at work.
- **Product/service photos:** If you're a restaurant, show the food. If you're a salon, show the work. If you're a clinic, show the equipment.
- **Logo and cover photo:** Make your profile look professional

**Upload at least 10-15 photos to start**, and add new ones every month. Google loves fresh content.

## Step 4: Get Reviews (And Respond to All of Them)

Reviews are the second biggest ranking factor after your category. But more importantly, they're what converts a searcher into a caller.

### How to get reviews:
- **Ask every happy customer.** Literally. After a successful appointment, delivery, or interaction, say: "It would really help us if you could leave a Google review."
- **Make it easy.** Create a short link to your review page and share it via WhatsApp. You can generate this link from your GBP dashboard.
- **Don't buy fake reviews.** Google's algorithms are getting very good at detecting them, and getting caught means your profile gets suspended.

### How to respond to reviews:
- **Respond to every single review** — positive and negative
- For positive reviews: Thank them personally, mention something specific
- For negative reviews: Be professional, acknowledge the issue, offer to resolve it offline

Google has confirmed that responding to reviews improves your local ranking.

## Step 5: Post Regular Updates

Most business owners don't know this, but Google Business Profile has a **Posts** feature — similar to social media. You can post updates, offers, events, and news directly on your profile.

Why bother? Two reasons:
1. It signals to Google that your business is active (which improves ranking)
2. It gives potential customers more reasons to choose you

**Post at least once a week.** Share offers, new products, seasonal updates, customer success stories, or even just a "we're open this Sunday" message.

## Step 6: Track Your Performance

Your GBP dashboard shows you exactly how your profile is performing:
- How many people viewed your profile
- How many people called you directly from the listing
- How many people asked for directions
- What search terms people used to find you

Check these numbers monthly. If calls are going up, you're doing something right. If views are high but calls are low, your profile might need better photos or more reviews.

## Common Mistakes Indian Businesses Make

1. **Keyword stuffing the business name** — This will get your profile suspended
2. **Using a personal mobile number** — Use a dedicated business number if possible
3. **Not updating hours** — Especially during festivals and holidays
4. **Ignoring negative reviews** — A thoughtful response can actually win you more customers
5. **Setting it and forgetting it** — GBP needs regular attention, just like social media
6. **Having blurry or dark photos** — Bad photos are worse than no photos
7. **Not choosing the right category** — This is the #1 ranking signal

## The Bottom Line

Your Google Business Profile is literally free marketing. It's the first thing people see when they search for businesses like yours. Yet most Indian small businesses either don't have one, or have one that's working against them instead of for them.

If you've read this far and realised your GBP needs work — we can help. We set up, optimise, and manage Google Business Profiles for Indian businesses every day. It's one of the three things we do, and we do it properly.

**WhatsApp us for a free audit of your current Google profile — we'll tell you exactly what's missing and what to fix first.**`},{slug:"meta-ads-vs-google-ads-small-business-india",title:"Meta Ads vs Google Ads: Which One Should Your Small Business Start With?",date:"2026-03-26",author:"Shivani Nile",coverImage:"/images/blog/Paid-ads.webp",ctaHeadline:"Still not sure which platform is right for your business?",ctaBody:"Stop guessing and wasting your ad budget. WhatsApp us and we'll tell you the exact strategy we'd use.",ctaButton:"Get a Free Ad Strategy",excerpt:"Every business owner asks this question. The answer isn't 'both' — it depends on your business, your budget, and what kind of customers you're trying to reach.",category:"Paid Ads",readingTime:"10 min read",metaDescription:"Meta Ads vs Google Ads for Indian small businesses — which platform should you start with? A practical comparison with real examples and budget guidance.",keywords:["meta ads vs google ads","facebook ads vs google ads india","which ads for small business","google ads or facebook ads better"],content:`## The Question Every Small Business Owner Asks

"Should I run Google Ads or Facebook Ads?"

We hear this question at least once a week. And the honest answer isn't "both" — that's what agencies say when they want to charge you more. The real answer depends entirely on your business.

Let us break it down properly.

## Understanding the Fundamental Difference

![Meta Ads vs Google Ads Comparison](/images/blog/Paid-ads.webp)

This is the most important thing to understand, and once you get it, everything else makes sense:

**Google Ads = Intent-based.** You're showing ads to people who are already searching for what you sell. They have a problem, they're looking for a solution, and you appear at the right moment.

**Meta Ads (Facebook/Instagram) = Interest-based.** You're showing ads to people who aren't actively searching, but who fit the profile of your ideal customer. You're interrupting their scrolling to introduce your business.

Think of it this way:
- Google Ads is like putting a signboard exactly where people are already looking
- Meta Ads is like putting a beautiful hoarding on a busy road — people notice it, but they weren't specifically looking for you

Neither is "better." They solve different problems.

## When to Start with Google Ads

Google Ads makes more sense when:

### 1. People are actively searching for your service
If someone types "dentist near me" or "best travel agent in Indore" — they want that service **right now**. If your ad appears at the top, you're getting a customer who's ready to act.

**Best for:** Clinics, salons, repair services, lawyers, travel agents, restaurants, coaching institutes, contractors, pest control, movers and packers.

### 2. You have a high-value service
If your average customer is worth ₹5,000-₹50,000+, Google Ads makes perfect sense because even a few conversions cover your ad spend.

### 3. You want local customers
Google's local search campaigns (especially combined with a well-optimised Google Business Profile) are incredibly powerful for local businesses. When someone searches "gym near me," your ad + your GBP listing can appear together.

### 4. Your budget is limited
With Google Ads, you only pay when someone clicks. And since they're already searching for what you offer, the conversion rate is typically higher than Meta Ads. You can start with as little as ₹500/day and get meaningful results.

## When to Start with Meta Ads

Meta Ads (Facebook + Instagram) make more sense when:

### 1. People don't know they need you yet
Some products and services need to be discovered. If you're selling a unique product, launching a new brand, or offering something people don't actively search for, Meta Ads are perfect for creating awareness and desire.

**Best for:** Fashion brands, food delivery, new restaurants, online courses, events, real estate projects, D2C brands, app downloads.

### 2. Your product is visual
If your product looks great in photos or videos, Meta Ads are your playground. A beautifully shot plate of food, a stunning outfit, or a before-and-after transformation will stop people mid-scroll.

### 3. You need to reach a specific audience
Meta's targeting is incredibly precise. You can target people by location, age, interests, behaviours, job titles, life events (recently married, new parents, recently moved), and more. No other platform offers this level of specificity.

### 4. You want to build a brand presence
Meta Ads don't just drive immediate sales — they build recognition. If someone sees your ad three times over two weeks, by the fourth time they see your brand, they remember you. This compounds over time.

## Real-World Examples

### Example 1: A Dental Clinic in Bhopal
**Problem:** Needs more patients walking in for consultations
**Our recommendation:** Google Ads
**Why:** People search "dentist near me" or "teeth cleaning Bhopal" when they have a problem. Google Ads captures that intent. Combined with a strong [Google Business Profile](/blog/how-to-set-up-google-business-profile-india-2026), this clinic can dominate local search results.
**Typical result:** 15-25 calls per week at ₹80-200+ per click (highly competitive)

### Example 2: A New Clothing Brand
**Problem:** Nobody knows the brand exists yet
**Our recommendation:** Meta Ads
**Why:** Nobody is searching for a brand they've never heard of. But you can show beautiful product photos to women aged 22-35 in metro cities who follow fashion pages. Once they discover you, they come back.
**Typical result:** ₹5-15 per website visit, strong retargeting potential

### Example 3: A Travel Agency in India
**Problem:** Wants to get enquiries for holiday packages
**Our recommendation:** Start with Meta Ads, add Google Ads later
**Why:** Travel is both search-driven and discovery-driven. Beautiful destination reels on Instagram get people dreaming, and then Google Ads captures them when they start searching "Manali package from Delhi." This is actually what we did for our first travel startup client — 150+ enquiries in the first month.

### Example 4: A Local Gym
**Problem:** Wants more membership sign-ups
**Our recommendation:** Google Ads + Local campaigns
**Why:** "Gym near me" gets thousands of searches every day. With a strong Google Business Profile showing your facility photos and good reviews, plus Google Ads running on top, you appear twice in the search results. That's very hard to ignore.

## The Budget Question

Let's talk real numbers for Indian businesses:

### Google Ads
- **Minimum viable budget:** ₹15,000-20,000/month
- **Average cost per click:** ₹20-80 (varies hugely by industry)
- **Expected calls/enquiries:** 20-50+ per month (depends on industry and competition)
- **Time to see results:** 2-4 weeks

### Meta Ads
- **Minimum viable budget:** ₹10,000-15,000/month
- **Average cost per lead:** ₹50-300 (varies by industry)
- **Expected leads:** 30-100+ per month
- **Time to see results:** 1-2 weeks (faster than Google)

### Combined (Both platforms)
- **Recommended budget:** ₹30,000+/month
- **Why higher:** You're covering two platforms, two strategies, two sets of creatives
- **When to do this:** After you've proven one platform works first

## Common Mistakes

### 1. Running both from day one
Unless your budget is ₹50,000+/month, don't split it between two platforms. Pick one, prove it works, then expand.

### 2. Judging too quickly
Both platforms need 2-4 weeks of data before you can tell if they're working. Don't turn off your ads after 3 days because you didn't get results.

### 3. Bad creatives
This kills both Google and Meta campaigns. If your ad looks like it was made in MS Paint, it doesn't matter how good your targeting is. (This is exactly why we handle creatives in-house.)

### 4. No landing page or proper Google profile
You can have the world's best ad, but if it sends people to a bad website or a half-empty Google profile, they'll bounce. The ad is only half the equation.

### 5. Not tracking conversions
If you can't track which ads are bringing you actual enquiries (not just clicks), you're flying blind. We set up proper conversion tracking on every campaign we run.

## Our Honest Take

Here's what we tell every client: **start with one platform, master it, then expand.**

For most local service businesses (clinics, salons, gyms, contractors, tutors), Google Ads + Google Business Profile is the fastest path to enquiries.

For product businesses, new brands, or anything visual, Meta Ads gets you discovered faster.

And for the creatives that go into these ads? That's the third thing we handle — because an ad with great targeting but bad creative is like a Ferrari with flat tyres.

**Not sure which platform is right for your business? WhatsApp us — we'll give you a straight answer, not a sales pitch.**`},{slug:"why-google-ads-not-working-india-5-mistakes",title:"Why Your Google Ads Are Not Working — 5 Mistakes Indian Businesses Make",date:"2026-03-24",author:"Shivani Nile",coverImage:"/images/blog/google-ads.webp",ctaHeadline:"Spending on Google Ads and not getting calls?",ctaBody:"WhatsApp us — we'll tell you exactly what's wrong with your campaign.",ctaButton:"Get Your Ads Audited",excerpt:"You're spending money on Google Ads but not getting calls or enquiries? These are the 5 most common reasons — and what to do about each one.",category:"Google Ads",readingTime:"9 min read",metaDescription:"Google Ads not bringing enquiries for your Indian business? Here are 5 common mistakes — wrong keywords, bad landing pages, no tracking, and more — with fixes.",keywords:["google ads not working","google ads mistakes india","why google ads no results","google ads for small business india"],content:`## "I Tried Google Ads. It Didn't Work."

We hear this all the time. A business owner spends ₹10,000-30,000 on Google Ads, gets a bunch of clicks, maybe a few random calls, and concludes that "Google Ads don't work for my business."

But here's the thing — Google Ads do work. Millions of businesses worldwide depend on them. When they don't work for you, it's almost always because of one of these five mistakes.

Let's go through each one.

## Mistake #1: Targeting the Wrong Keywords

![Google Ads Keyword targeting](/images/blog/google-ads.webp)

This is the single biggest money-waster in Google Ads. Most businesses either:

- **Target keywords that are too broad:** Like "dental" or "travel" — these get tons of clicks from people who aren't your customers (students researching, people looking for dental colleges, etc.)
- **Target keywords that are too competitive:** Like "best dentist in Mumbai" — you're competing against massive clinics with massive budgets
- **Forget negative keywords entirely:** Negative keywords tell Google what NOT to show your ads for. Without them, you'll get clicks for "dental admission," "dental job," or "free dental check-up" when you're a premium clinic

### The Fix:
- Use **specific, intent-driven keywords:** "teeth whitening cost Jaipur" beats "dental clinic"
- Add **negative keywords** aggressively: "jobs," "salary," "free," "admission," "PDF," "course," "YouTube"
- Use **location targeting** properly: If you serve Bhopal, don't show ads nationally
- Start with **phrase match or exact match** keywords, not broad match

**Example:** One of our clients was spending ₹15,000/month on the keyword "construction" in broad match. They were getting clicks from people searching "construction job vacancy" and "construction material price." After we switched to specific keywords like "building contractor [city name]" and "house construction cost per sq ft," their cost per enquiry dropped by 60%.

## Mistake #2: Your Landing Page is Terrible (or Missing)

Imagine you click an ad for "best biryani in Hyderabad" and you land on a generic homepage with no mention of biryani, no menu, no address, and no way to order. You'd leave immediately, right?

That's what happens when your Google Ad sends people to:
- Your generic homepage instead of a relevant page
- A page that takes 10 seconds to load
- A page with no clear call-to-action (phone number, WhatsApp button, booking form)
- A page that isn't mobile-friendly (80%+ of Indian searches happen on mobile)

### The Fix:
- Send ad traffic to a **specific, relevant page** — not your homepage
- Make sure your phone number and WhatsApp button are **visible within 2 seconds** of landing
- **Optimise for mobile first** — test your pages on a phone, not just a laptop
- Page load time should be under 3 seconds (Google will actually show your ads less if your page is slow)

If you don't have a website at all, that's actually not a deal-breaker. Your [Google Business Profile](/blog/how-to-set-up-google-business-profile-india-2026) can serve as your landing page for local search ads. But you need it to be fully optimised — complete information, good photos, and plenty of reviews.

## Mistake #3: You're Not Tracking Conversions

Here's a scenario we see constantly:

Business owner: "Google Ads aren't working. I only got 50 clicks."
Us: "How many of those 50 clicks called you or WhatsApped you?"
Business owner: "...I don't know."

If you're not tracking conversions, you literally have no idea if your ads are working or not. Clicks alone mean nothing. What matters is:
- How many people **called** you from the ad?
- How many people **submitted a form** or sent a message?
- How many of those turned into **actual paying customers?**

### The Fix:
- Set up **Google Ads conversion tracking** (calls, form submissions, WhatsApp clicks)
- Use **call tracking** to know which calls came from ads vs. organic
- Track the entire funnel: click → call → customer
- Review your conversion data weekly, not monthly

Without conversion tracking, you're literally guessing. And guessing with your ad budget is expensive.

## Mistake #4: You Set It and Forgot It

This is painfully common. Someone (often the business owner themselves, or a "digital marketing guy" they hired for ₹5,000/month) sets up a Google Ads campaign, and then nobody touches it for weeks or months.

Google Ads is not a set-and-forget system. It needs regular attention:
- **Keywords need pruning:** Some keywords will waste money and need to be paused or removed
- **Bids need adjusting:** As competition changes, your bids need to change too
- **Ad copy needs testing:** The first ad you write is rarely the best one
- **Negative keywords need updating:** New irrelevant searches pop up every week
- **Budget allocation needs shifting:** You need to put more budget on what's working and cut what isn't

### The Fix:
- Review and optimise your campaigns **at least once a week**
- Check the **Search Terms report** weekly — this shows you exactly what people searched before clicking your ad
- A/B test at least 2-3 different ad variations
- Adjust bids based on which times of day and days of week perform best
- Kill underperforming keywords quickly — don't let them drain your budget

**This is honestly the main reason businesses hire us.** Most business owners don't have 3-4 hours a week to properly manage their Google Ads. It's our job, and we do it consistently because that's how results happen.

## Mistake #5: Your Offer Isn't Compelling Enough

Sometimes the ads are set up perfectly — right keywords, good landing page, proper tracking — but the offer itself doesn't motivate anyone to act.

Compare these two ads:

**Ad A:** "Dental Clinic in Jaipur. Book Now."
**Ad B:** "Teeth Cleaning Starting ₹999. Same-day appointments. 4.8★ rated on Google."

Which one would you click? Ad B gives you a reason to act — price transparency, convenience, social proof.

### The Fix:
- Include **specific benefits** in your ad copy, not just features
- Use **numbers:** prices, ratings, years of experience, customer count
- Add **urgency** when genuine: "Limited slots," "Offer ends Sunday"
- Show **social proof:** "500+ patients treated," "4.8★ Google reviews"
- Include a **clear call-to-action:** "Call now," "Book today," "WhatsApp for a quote"

## Bonus: One More Thing That Kills Performance

**Your Google Business Profile is weak or non-existent.**

When someone clicks on a local search ad, they often also check your Google Business Profile. If your profile has:
- Few or no reviews
- No photos
- Incomplete information
- A 3.2-star rating

...they'll choose your competitor with 50 reviews and a 4.7-star rating instead. Your ad got the click, but your GBP lost the customer.

This is why we always tell clients: **fix your [Google Business Profile](/blog/how-to-set-up-google-business-profile-india-2026) before spending money on Google Ads.** The two work together.

## The Real Problem

Most of the time, Google Ads don't fail because the platform doesn't work. They fail because:
1. They're set up by someone who doesn't understand the platform deeply
2. They're not managed regularly
3. The supporting infrastructure (GBP, landing page, tracking) isn't in place

We've taken over campaigns from businesses who were spending ₹30,000/month with zero enquiries, and turned them into ₹30,000/month with 30-40 enquiries. Same budget, completely different results. The difference? Proper setup, proper management, and proper creatives.

**Think your Google Ads could be performing better? WhatsApp us for a free audit — we'll tell you exactly what's wrong and how to fix it.**`},{slug:"facebook-ads-cost-india-2026-real-numbers",title:"How Much Do Facebook Ads Cost in India? Real Numbers, No Fluff",date:"2026-03-22",author:"Shivani Nile",coverImage:"/images/blog/meta-ads.webp",ctaHeadline:"Want realistic numbers for your specific business?",ctaBody:"WhatsApp us for a custom budget breakdown based on your industry and city.",ctaButton:"Get Custom Estimates",excerpt:"Everyone wants to know the cost before they start. Here's what Facebook/Meta Ads actually cost in India across different industries, with real benchmarks.",category:"Meta Ads",readingTime:"9 min read",metaDescription:"What do Facebook ads actually cost in India in 2026? Real CPC, CPM, and cost-per-lead numbers across industries. Honest breakdown with no agency fluff.",keywords:["facebook ads cost india","meta ads cost india 2026","facebook advertising cost","how much facebook ads cost"],content:`## Let's Talk Real Numbers

If you Google "Facebook ads cost in India," you'll find articles saying "it depends" 47 different ways without actually telling you anything useful. We're going to do better than that.

After managing Meta (Facebook + Instagram) ad campaigns for multiple Indian businesses, here are the real numbers — not theoretical, not global averages, but actual India-specific costs. *(Note: These are 2026 benchmarks based on campaigns we've managed; costs vary by season and competition.)*

## How Facebook Ads Pricing Works

![Facebook Ads Pricing Model](/images/blog/meta-ads.webp)

Before we get into numbers, you need to understand the basics:

**You don't pay a fixed price.** Facebook ads work on an auction system. You're competing with other advertisers to show your ad to the same audience. The cost depends on:

1. **Your audience:** The more advertisers targeting the same people, the higher the cost
2. **Your ad quality:** Better ads (higher engagement) actually cost less per result
3. **Your industry:** Finance and real estate ads cost more than food delivery ads
4. **Your timing:** Costs spike during festivals (Diwali, New Year) and sales seasons
5. **Your objective:** Optimising for leads costs more than optimising for reach

You can set a **daily budget** (minimum ₹65/day) or a **lifetime budget** for the campaign. You'll never spend more than your budget.

## The Real Costs (India, 2026)

### Cost Per 1000 Impressions (CPM)

CPM is what it costs to show your ad to 1,000 people. In India:

| Audience Type | Average CPM |
|---|---|
| Broad audience (Tier 1 cities) | ₹80-200 |
| Broad audience (Tier 2-3 cities) | ₹40-100 |
| Interest-based targeting | ₹100-250 |
| Lookalike audiences | ₹120-300 |
| Retargeting (website visitors) | ₹150-400 |

**What this means:** If you spend ₹10,000, your ad will be shown to roughly 40,000-1,00,000 people depending on your targeting.

### Cost Per Click (CPC)

CPC is what you pay each time someone clicks your ad. In India:

| Industry | Average CPC |
|---|---|
| Food & Restaurants | ₹3-10 |
| Fashion & Apparel | ₹5-15 |
| Beauty & Wellness | ₹8-20 |
| Education & Coaching | ₹10-25 |
| Real Estate | ₹15-50 |
| Healthcare & Clinics | ₹10-30 |
| Travel & Tourism | ₹8-25 |
| Finance & Insurance | ₹20-60 |
| E-commerce (general) | ₹5-15 |

### Cost Per Lead (CPL)

This is the most important number — what it costs to get an actual enquiry (form fill, WhatsApp message, or call). In India:

| Industry | Average CPL |
|---|---|
| Food & Restaurants | ₹30-80 |
| Fashion & Apparel | ₹50-150 (purchase, not lead) |
| Beauty & Wellness | ₹80-200 |
| Education & Coaching | ₹100-300 |
| Real Estate | ₹200-800 |
| Healthcare & Clinics | ₹100-300 |
| Travel & Tourism | ₹80-250 |
| Finance & Insurance | ₹200-600 |

**Important note:** These are averages. Good campaigns with good creatives can beat these numbers significantly. Bad campaigns can be much worse.

## What Determines If You're on the Lower or Higher End?

### Factors that reduce your costs:
1. **Great creatives** — Ads with high engagement (likes, comments, shares) cost less. Facebook rewards content people actually want to see.
2. **Precise targeting** — The more specific and relevant your audience, the better your results. Targeting "women aged 25-40 in Pune who follow wedding planning pages" is better than targeting "all women in Maharashtra."
3. **Strong offer** — A clear, compelling offer ("Free consultation," "50% off first visit") drives more clicks and conversions, bringing your cost per result down.
4. **Good landing experience** — If people click your ad and find what they expected (not a slow, confusing page), your conversion rate goes up and cost per lead goes down.
5. **Ongoing optimisation** — Campaigns that are actively managed and optimised weekly outperform those that are left running on autopilot.

### Factors that increase your costs:
1. **Bad ad creative** — Blurry images, boring copy, generic stock photos. If people scroll past your ad, Facebook shows it to fewer people at a higher cost.
2. **Too broad targeting** — Showing your ad to 50 million people when your potential customers are 500,000 wastes money on irrelevant impressions.
3. **Competition** — Some industries (real estate, finance, education) are heavily advertised, pushing costs up for everyone.
4. **Festival seasons** — Diwali, Christmas, New Year, Republic Day sales — everyone advertises during these periods, so auction prices spike.
5. **No optimisation** — "Set it and forget it" campaigns always get more expensive over time.

## Real Budget Recommendations for Indian Businesses

Based on our experience, here's what we recommend as a **starting budget:**

### Just Starting Out (Testing Phase)
- **Budget:** ₹10,000-15,000/month
- **What you get:** 3,000-10,000 people seeing your ad, 100-300 clicks, 10-30 leads
- **Duration:** Run for 30 days minimum before judging results
- **Best for:** Testing if Meta Ads work for your business

### Ready to Scale
- **Budget:** ₹20,000-40,000/month
- **What you get:** Consistent lead flow, ability to test multiple ad sets and creatives
- **Best for:** Businesses that have validated its working and want more volume

### Serious Growth Mode
- **Budget:** ₹50,000-1,00,000+/month
- **What you get:** Full-funnel campaigns (awareness + retargeting), enough data for AI optimisation to kick in properly
- **Best for:** Businesses with proven unit economics who want to scale aggressively

## The Hidden Costs Most Articles Don't Mention

Here's what nobody tells you about the "cost" of Facebook Ads:

### 1. Creative Production
You need new ad creatives regularly. Using the same image for 3 months means your audience gets "ad fatigue" — they've seen it too many times and stop engaging. Budget for 4-8 new creative variations per month.

Most agencies charge ₹5,000-15,000/month extra for creative design. (We don't — creatives are included because we believe ads and creatives should be built together, not separately.)

### 2. Landing Page / WhatsApp Response
If your ads drive people to WhatsApp but nobody responds for 6 hours, you've wasted that lead. Fast response = higher conversion. Budget for the time (or team) to respond quickly.

### 3. Learning Period Costs
Every new campaign goes through a "learning phase" where Facebook's algorithm is figuring out who to show your ad to. During this period (usually 3-7 days), costs are higher than normal. Don't panic and turn off the campaign during this phase.

### 4. Your Time (Or Your Agency's Fee)
Running Facebook Ads properly takes 4-6 hours per week — monitoring, optimising, creating new ads, analysing results. If you're doing it yourself, that's time away from running your business. If you're hiring an agency, factor in their management fee.

## Is It Worth It?

Let's do some simple maths:

**Scenario:** You're a dental clinic. You spend ₹15,000/month on Meta Ads. Your average cost per lead is ₹150. That's 100 leads per month. If 20% of leads book an appointment, that's 20 new patients. If each patient is worth ₹3,000 on average, that's ₹60,000 in revenue from a ₹15,000 ad spend.

**That's a 4x return on investment.** And this is a conservative example.

The key isn't whether Facebook Ads are "expensive" or "cheap" — the key is whether the revenue they generate exceeds the cost. For most businesses we work with, they do — often within the first month.

## Our Honest Take

Facebook Ads are one of the most cost-effective ways for Indian businesses to reach new customers. But — and this is a big but — they only work well when:

1. **The creatives are strong** (not generic templates)
2. **The targeting is precise** (not "let's target everyone")
3. **The campaigns are actively managed** (not set-and-forget)
4. **The landing experience is good** (fast page, clear CTA, quick response)

If any of these four things are missing, you'll spend money and feel like "it doesn't work."

**Want to know what Meta Ads would cost for your specific business? WhatsApp us — we'll give you realistic numbers based on your industry and location, not generic estimates.**`},{slug:"5-signs-business-needs-digital-marketing-agency-india",title:"5 Signs Your Local Business Needs a Digital Marketing Agency",date:"2026-03-20",author:"Shivani Nile",coverImage:"/images/blog/business-growth.webp",ctaHeadline:"Ready to stop doing it all yourself?",ctaBody:"If you're seeing these signs, it's time to bring in proper help. WhatsApp us to see if we're a fit.",ctaButton:"WhatsApp Us",excerpt:"Not every business needs an agency. But if you're seeing these 5 signs, trying to do it yourself is costing you more than hiring help would.",category:"Business Growth",readingTime:"8 min read",metaDescription:"5 clear signs your Indian small business needs professional digital marketing help. When DIY stops working and it's time to hire an agency that understands your business.",keywords:["digital marketing agency for small business india","when to hire digital marketing agency","local business marketing india","small business digital marketing"],content:`## Not Every Business Needs an Agency

Let's start with honesty — not every business needs a digital marketing agency. If you're a freelancer who gets clients through referrals and you're happy with your workload, keep doing what you're doing.

But if you're a business that depends on a steady flow of new customers — a clinic, a salon, a gym, a restaurant, a travel agency, a coaching institute — and that flow isn't consistent, that's a different situation.

Here are the five signs that tell you it's time to stop trying to figure out digital marketing on your own.

## Sign #1: You're Getting Fewer Enquiries Than You Should

Your business is good. Your product or service is solid. Your existing customers are happy. But new enquiries? They're either not coming, or they're coming in too slowly.

This usually happens because:
- Your Google Business Profile is invisible or poorly optimised
- You're not showing up when people search for businesses like yours
- Your competitors are running ads and you're not
- Your social media posts are getting 15 likes from your friends and family, not from potential customers

**The test:** Google your business type + your city. Example: "dentist in Jaipur" or "travel agent in Bhopal." If you're not in the top 3-5 results (either in ads or maps), potential customers are literally choosing your competitors over you — not because they're better, but because they're more visible.

**What an agency does:** We figure out exactly where you're losing visibility and fix it. Sometimes it's your Google profile. Sometimes it's that you need ads. Sometimes it's both. But first, we diagnose the actual problem.

## Sign #2: You Tried Running Ads Yourself (And It Didn't Go Great)

This is one of the most common situations we see. A business owner watches a YouTube tutorial, sets up a Meta or Google Ads campaign, spends ₹10,000-20,000, gets a bunch of random clicks, and decides "ads don't work for my business."

But here's the reality — the ads didn't fail because the platform doesn't work. They failed because:

- **Wrong targeting:** Showing your dental clinic to everyone in Maharashtra instead of people within 5 km
- **Wrong keywords:** Bidding on broad terms that attract job seekers and students instead of customers
- **Bad creatives:** Using a blurry photo with Comic Sans text doesn't stop anyone from scrolling
- **No tracking:** You have no idea which clicks turned into actual enquiries
- **No optimisation:** The campaign ran for 30 days with zero adjustments

Running ads well requires 4-6 hours per week of active management. That's 15-25 hours per month that you could be spending on running your business.

**What an agency does:** We set up the campaigns properly from day one — right targeting, right keywords, right creatives, proper tracking. Then we optimise every week. Same budget, dramatically different results.

## Sign #3: You're Spending More Time on Marketing Than on Your Business

![Business Owner Overwhelmed with Marketing](/images/blog/business-growth.webp)

You know something's wrong when:
- You're staying up late trying to design a Facebook post in Canva
- You're watching the 15th YouTube video on "how to rank on Google"
- You're spending your evenings responding to Instagram DMs instead of being with your family
- You're trying to figure out Google Analytics when you should be seeing patients/clients/customers

Here's a question: what's your hourly earning potential? If you're a doctor, lawyer, consultant, or business owner earning ₹1,000-5,000+ per hour, spending 3-4 hours a day on DIY marketing is literally losing you ₹3,000-20,000 per day.

Hiring an agency that costs ₹15,000-30,000 per month is almost always cheaper than the time and opportunity cost of doing it yourself (badly).

**What an agency does:** We take the entire marketing workload off your plate. You focus on your business. We focus on getting you more customers. You get a WhatsApp update from us, you say "looks good," and that's the extent of your marketing involvement.

## Sign #4: Your Competitors Are Pulling Ahead Online

Warning signs:
- Your competitor has 200+ Google reviews and you have 12
- When you search for your service + city, their name appears everywhere
- They're running ads and showing up at the top of Google
- Their Instagram looks professional while yours has phone photos with bad lighting
- Customers tell you "I found them on Google" when you ask how they heard about them

Digital marketing has a compounding effect. The business that starts early and stays consistent builds a massive advantage over time. Every month you wait, the gap gets wider.

**This isn't about being on "every platform."** It's about being findable when a customer is looking for exactly what you offer. If your competitor is there and you're not, you're losing that customer — every single time.

**What an agency does:** We analyse what your competitors are doing online, identify the gaps, and build a plan that gets you visible. We don't need you to be on 10 platforms. We need you to dominate the 1-2 platforms that matter for your business.

## Sign #5: You Don't Know What's Working and What's Not

Can you answer these questions about your business right now?

1. How many people find your business on Google each month?
2. How many calls come from your Google Business Profile?
3. What percentage of your customers found you online vs. through referrals?
4. If you're running ads, what's your cost per enquiry?
5. Which marketing channel brings you the most revenue?

If you can't answer even one of these questions, you're making decisions without data. And decisions without data are expensive.

Most business owners we talk to have no idea how customers are finding them. They're spending money on social media, sometimes running ads, maybe paying for a website — but they can't tell you which of these things is actually bringing in business.

**What an agency does:** We install proper tracking from day one. Every month, you know exactly how many enquiries came from where, what each enquiry cost, and what's working vs. what isn't. No fancy dashboards with meaningless metrics — just the numbers that matter for your business.

## But Which Agency?

If you've recognised yourself in 2 or more of these signs, the next question is who to hire. Here's our honest advice:

### Avoid agencies that:
- **Lock you into long contracts** — If they're confident in their work, they don't need a 6-month lock-in
- **Promise unrealistic results** — "We'll 10x your revenue in 30 days" is a lie
- **Won't tell you what they're doing** — If you can't understand the strategy, something is wrong
- **Outsource everything** — Your brand deserves more than a freelancer in another city who's managing 30 other clients
- **Only talk about impressions and reach** — These are vanity metrics. Ask about enquiries and leads.

### Look for agencies that:
- **Speak in results** — enquiries, calls, leads, customers — not impressions and clicks
- **Work with businesses like yours** — They understand your challenges because they've solved them before
- **Are transparent** — You know what they're doing, why, and how it's performing
- **Handle multiple things together** — Ads + creatives + GBP working as one system, not three separate invoices
- **Respond quickly** — If an agency takes 3 days to reply to your initial message, imagine how they'll treat you as a client

## Our Honest Take

We built Ad Wali Didi specifically for Indian small businesses that need real marketing help without the enterprise price tag. We handle Google Business Profile, Paid Ads, and Ad Creatives.

If your current marketing isn't bringing in the enquiries you need, let's have a straightforward WhatsApp chat about what we can do.`}];var i=e.i(72520),r=e.i(87316),l=e.i(3116),u=e.i(24511),d=e.i(78397);e.s(["BlogContent",0,function(){let[e,c]=(0,o.useState)(!1);return(0,o.useEffect)(()=>{c(!0)},[]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("section",{className:"pt-32 pb-8 sm:pt-40 sm:pb-12 bg-teal-tint",children:(0,t.jsxs)("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center",children:[(0,t.jsx)(u.m.div,{initial:{opacity:0,y:20},animate:{opacity:+!!e,y:20*!e},transition:{duration:.8},children:(0,t.jsx)("h1",{className:"font-[var(--font-syne)] text-4xl sm:text-5xl lg:text-6xl font-bold text-near-black leading-tight",children:"Blog"})}),(0,t.jsx)(u.m.p,{className:"mt-6 text-lg sm:text-xl text-muted-text max-w-2xl mx-auto leading-relaxed",initial:{opacity:0,y:20},animate:{opacity:+!!e,y:20*!e},transition:{duration:.8,delay:.2},children:"Real marketing advice for Indian businesses. No jargon, no fluff — just things that actually work."})]})}),(0,t.jsx)("section",{className:"py-16 sm:py-20 bg-white",children:(0,t.jsx)("div",{className:"max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8",children:n.map((o,n)=>(0,t.jsx)(u.m.div,{initial:{opacity:0,y:20},whileInView:{opacity:+!!e,y:20*!e},viewport:{once:!0,margin:"-50px"},transition:{duration:.6,delay:n%3*.1},children:(0,t.jsxs)(s.default,{href:`/blog/${o.slug}`,className:"group bg-white rounded-2xl overflow-hidden shadow-sm border border-teal-border hover:shadow-lg transition-all duration-300 flex flex-col h-full",children:[(0,t.jsxs)("div",{className:"relative aspect-[16/9] overflow-hidden",children:[(0,t.jsx)(a.default,{src:o.coverImage,alt:o.title,fill:!0,className:"object-cover transition-transform duration-500 group-hover:scale-105"}),(0,t.jsx)("div",{className:"absolute inset-0 bg-gradient-to-t from-near-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"})]}),(0,t.jsxs)("div",{className:"p-6 sm:p-8 flex-1 flex flex-col",children:[(0,t.jsx)("div",{className:"flex items-center gap-3 mb-4",children:(0,t.jsx)("span",{className:"px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-tint text-teal",children:o.category})}),(0,t.jsx)("h2",{className:"font-[var(--font-syne)] text-lg sm:text-xl font-bold text-near-black leading-snug group-hover:text-teal transition-colors",children:o.title}),(0,t.jsx)("p",{className:"mt-3 text-muted-text text-sm leading-relaxed line-clamp-3",children:o.excerpt}),(0,t.jsxs)("div",{className:"mt-6 flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-4 text-xs text-muted-text",children:[(0,t.jsxs)("span",{className:"flex items-center gap-1",children:[(0,t.jsx)(r.Calendar,{size:12}),new Date(o.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})]}),(0,t.jsxs)("span",{className:"flex items-center gap-1",children:[(0,t.jsx)(l.Clock,{size:12}),o.readingTime]})]}),(0,t.jsx)(i.ArrowRight,{size:16,className:"text-teal opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"})]})]})]})},o.slug))})})}),(0,t.jsx)("section",{className:"py-16 sm:py-20 bg-deep-teal",children:(0,t.jsx)("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center",children:(0,t.jsxs)(u.m.div,{initial:{opacity:0,y:20},whileInView:{opacity:+!!e,y:20*!e},viewport:{once:!0,margin:"-100px"},transition:{duration:.8},children:[(0,t.jsx)("h2",{className:"font-[var(--font-syne)] text-2xl sm:text-3xl lg:text-4xl font-bold text-white",children:"Want these strategies applied to your business?"}),(0,t.jsx)("p",{className:"mt-4 text-white-70 text-lg max-w-2xl mx-auto",children:"Reading about it is one thing. Having someone do it for you is another."}),(0,t.jsxs)(u.m.a,{href:"https://wa.me/916261643774?text=Hi!%20I%20read%20your%20blog%20and%20I'd%20like%20to%20discuss%20marketing%20for%20my%20business.",target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-2 bg-gold text-near-black px-8 py-4 rounded-full font-medium text-lg hover:bg-darker-gold transition-all hover:scale-105 shadow-lg mt-8",initial:{opacity:0,y:20},whileInView:{opacity:+!!e,y:20*!e},viewport:{once:!0},transition:{duration:.8,delay:.2},children:[(0,t.jsx)(d.WhatsAppIcon,{size:20}),"WhatsApp Us — Let's Talk"]})]})})})]})}],60380)}]);