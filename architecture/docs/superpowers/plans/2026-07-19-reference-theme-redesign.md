# Reference Theme Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ปรับหน้า architecture ให้มี visual language ใกล้เคียงเว็บไซต์อ้างอิง พร้อม scroll rhythm และ visual haptic ที่สุภาพ

**Architecture:** คง HTML แบบไฟล์เดียวและเพิ่ม theme override CSS เพื่อจำกัดความเสี่ยงต่อเนื้อหาเดิม ใช้ IntersectionObserver เพิ่ม class ให้ section/card ครั้งเดียว และใช้ CSS keyframes สำหรับ reveal กับ heading nudge

**Tech Stack:** HTML5, CSS custom properties, CSS animations, vanilla JavaScript, Vercel static deployment

## Global Constraints

- คงเนื้อหา โลโก้จริง anchors และสถานะ “รอตรวจสอบ”
- ไม่เพิ่ม dependency
- รองรับ desktop, mobile, print และ prefers-reduced-motion
- ไม่ใช้ Vibration API

---

### Task 1: Theme and layout

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: semantic sections and existing class names
- Produces: cream/orange/black theme with editorial cards and responsive layout

- [ ] เพิ่ม theme override หลัง CSS เดิม เพื่อปรับ navigation, hero, cards, diagrams, system sections, stack, deployment และ footer
- [ ] ตรวจว่า anchor และคำว่า “รอตรวจสอบ” ยังอยู่ครบ
- [ ] ตรวจ mobile CSS และ horizontal overflow ด้วย static assertions

### Task 2: Motion system

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `.section`, `.heading`, cards and IntersectionObserver
- Produces: `.is-visible` and `.heading-kick` states

- [ ] เพิ่ม reveal/stagger styles และ keyframe visual haptic
- [ ] เพิ่ม IntersectionObserver ที่ทำงานครั้งเดียวต่อ element
- [ ] เพิ่ม fallback เมื่อไม่มี IntersectionObserver
- [ ] ปิด motion ภายใต้ `prefers-reduced-motion: reduce`

### Task 3: Verification and release

**Files:**
- Modify: `architecture/index.html` in GitHub repository

**Interfaces:**
- Consumes: finalized local static files
- Produces: production deployment on existing Vercel alias

- [ ] ตรวจ HTML markers, logos, statuses, anchors, motion hooks และ responsive rules
- [ ] Push `index.html` และเอกสาร plan ไป GitHub
- [ ] Deploy static files to Vercel production
- [ ] Poll deployment until state is READY and report existing production URL
