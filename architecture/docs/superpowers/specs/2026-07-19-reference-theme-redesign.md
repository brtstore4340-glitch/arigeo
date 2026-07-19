# ARIGEO Platform Architecture — Reference Theme Redesign

## Objective

ปรับหน้าเอกสารสถาปัตยกรรมให้มีภาษาภาพใกล้เคียง claudecoworkclass.com มากขึ้น โดยคงเนื้อหา โลโก้จริง ลำดับข้อมูล และสถานะ “รอตรวจสอบ” ไว้ครบถ้วน

## Visual Direction

- ใช้พื้นหลังครีมและขาวนวล ตัดด้วยสีดำ สีส้ม และสีเหลือง
- ใช้หัวข้อไทยขนาดใหญ่ น้ำหนักสูง และ line-height กระชับ
- Navigation โปร่ง เรียบ และมีปุ่มสถานะเด่นที่มุมขวา
- การ์ดใช้เส้นขอบเข้ม มุมโค้งเล็ก และเงาแข็งแบบมีมิติ
- Section label ภาษาอังกฤษขนาดเล็กทำหน้าที่เป็น eyebrow เหนือหัวข้อไทย
- ลดโทนน้ำเงิน Corporate เดิม เหลือใช้เป็นสีประกอบเฉพาะข้อมูลเชิงเทคนิค
- ใช้พื้นที่ว่างและการสลับพื้นหลังเพื่อสร้างจังหวะการอ่านเอกสารยาว

## Layout

- Hero แบ่งเป็นข้อความหลักขนาดใหญ่และ architectural demonstration card
- ภาพรวมระบบใช้การ์ดสามระบบที่มีหมายเลขและลำดับสายตาชัดเจน
- Data Flow แสดงเป็น sequence ที่อ่านต่อเนื่องจาก CMS ไปยังเว็บไซต์
- รายละเอียดแต่ละระบบใช้ alternating editorial layout
- Technology Stack ใช้แถวข้อมูลคล้าย curriculum/schedule
- Delivery Status และ acceptance gate ใช้กรอบสีอุ่น พร้อม badge “รอตรวจสอบ”

## Motion and Scroll Rhythm

- Section และ card ปรากฏด้วยการเลื่อนขึ้นและ fade ระยะสั้นเมื่อเข้าสู่ viewport
- ใช้ stagger เล็กน้อยกับรายการที่อยู่ในกลุ่มเดียวกัน
- เมื่อหัวข้อใหม่เข้าสู่จุดอ่าน จะเกิด “visual haptic” หนึ่งครั้ง: translate 2–3px และ accent line/marker pulse สั้น ๆ
- การเคลื่อนไหวต้องนุ่ม สุขุม และไม่เล่นซ้ำระหว่างการเลื่อนกลับไปมาใน session เดียว
- ใช้ IntersectionObserver เพื่อไม่สร้างภาระจาก scroll event
- ปิด animation และ visual haptic เมื่อระบบตั้งค่า prefers-reduced-motion: reduce
- ไม่เรียกใช้ Vibration API และไม่ทำให้อุปกรณ์สั่นจริง

## Responsive and Accessibility

- รักษาลำดับเนื้อหาเดิมบนมือถือ และลด motion distance สำหรับจอเล็ก
- คอนทราสต์ข้อความต้องอ่านได้บนพื้นครีม/ส้ม/เหลือง
- Navigation มือถือยังเข้าถึงสถานะ “รอตรวจสอบ” ได้
- รูปภาพโลโก้มี alt text และไม่ใช้ animation ที่รบกวนการอ่าน
- Print stylesheet ตัด animation, sticky navigation และ decorative effects

## Technical Scope

- ปรับเฉพาะ static HTML, CSS และ JavaScript ภายในโครงการ architecture
- ไม่เปลี่ยนข้อมูลสถาปัตยกรรม API หรือระบบของ ARIGEO/Captain Maid/CMS
- โลโก้ ARIGEO ใช้ asset จริงที่จัดเก็บร่วมกับ deployment
- โลโก้ Captain Maid ใช้ asset จริงจาก repository ต้นทาง
- Deploy production ทับโครงการ Vercel และ alias เดิม

## Acceptance Criteria

- ภาพรวมใกล้เคียงเว็บอ้างอิงอย่างชัดเจนโดยไม่คัดลอกข้อความหรือทรัพย์สินกราฟิก
- มีมิติและจังหวะการไหลของหน้าจอทั้ง desktop และ mobile
- หัวข้อใหม่มี visual haptic ที่สังเกตได้แต่ไม่รบกวน
- สถานะมุมขวาบนและการ์ดทั้งสามแสดง “รอตรวจสอบ”
- โลโก้ ARIGEO และ Captain Maid แสดงผลจริง
- ไม่มี horizontal overflow และ navigation anchors ยังทำงาน
- Production deployment มีสถานะ READY บน URL เดิม
