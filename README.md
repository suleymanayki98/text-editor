# Drag and Drop Editor - Frontend

Bu proje, React ve Material-UI kullanılarak geliştirilmiş bir sürükle-bırak editörüdür. Kullanıcılar, çeşitli bileşenleri ekleyebilir, düzenleyebilir ve yeniden sıralayabilir.

## Kurulum

## `cd frontend`

### `npm install`

## Projeyi Başlatma

### `npm start`

## Özellikler

- Sürükle ve bırak işlevselliği
- Paragraf, başlık, buton ve sütun bileşenleri
- Canlı kaynak kodu görüntüleme ve düzenleme
- Geri alma ve yeniden yapma işlevleri
- E-posta verilerini düzenleme modalı
- Responsive tasarım

## Bileşenler ve İşlevleri

### DragDropEditor
Ana bileşen olup, editörün tüm mantığını ve durumunu yönetir.

- `components`: Editördeki tüm bileşenleri içeren durum.
- `sourceCode`: Her bölüm için HTML kaynak kodunu tutan durum.
- `undoStack` ve `redoStack`: Geri alma ve yeniden yapma işlevselliği için.
- `emailData`: E-posta verilerini saklar.

Temel işlevler:
- `updateComponents`: Bileşenleri günceller ve değişiklikleri kaydeder.
- `onDragStart`, `onDragOver`, `onDrop`: Sürükle-bırak işlevselliğini yönetir.
- `undo`, `redo`: Geri alma ve yeniden yapma işlemlerini gerçekleştirir.
- `handleSourceCodeChange`: Kaynak kodu değişikliklerini işler.
- `renderComponent`: Her bir bileşeni render eder.

### Sidebar
Eklenebilecek bileşenleri içeren kenar çubuğu.

- Paragraf, başlık, buton ve sütun bileşenlerini sürüklenebilir öğeler olarak sunar.

### EditorArea
Ana düzenleme alanı.

- Bileşenleri görüntüler ve düzenleme yapılmasına olanak tanır.
- Kaynak kodu görüntüleme ve düzenleme özelliği sunar.

### Toolbar
Üst araç çubuğu.

- Kenar çubuğunu açma/kapama düğmesi
- Geri alma ve yeniden yapma düğmeleri
- Kaynak kodu gösterme/gizleme düğmesi

### EmailModal
E-posta verilerini düzenlemek için kullanılan modal.

- E-posta adresi ve buton metni gibi verileri düzenleme imkanı sunar.

### BackendService

- Backend isteklerini tutan servis

### Bileşen Türleri

1. **Paragraph (COMPONENT_TYPES.PARAGRAPH)**
   - Düzenlenebilir metin paragrafı.

2. **Button (COMPONENT_TYPES.BUTTON)**
   - E-posta gönderme işlevine sahip buton.
   - E-posta verilerini düzenlemek için yan menü içerir.

3. **Heading 1 (COMPONENT_TYPES.H1)**
   - Büyük başlık bileşeni.

4. **Heading 2 (COMPONENT_TYPES.H2)**
   - Orta boy başlık bileşeni.

5. **Two Column Layout (COMPONENT_TYPES.TWO_COLUMN)**
   - İki sütunlu düzen bileşeni.
   - Her sütuna ayrı bileşenler eklenebilir.

6. **One Column Layout (COMPONENT_TYPES.ONE_COLUMN)**
   - Tek sütunlu düzen bileşeni.
   - İçine diğer bileşenler eklenebilir.

Her bileşen sürüklenebilir, düzenlenebilir ve silinebilir özelliktedir.

# Drag and Drop Editor - Backend

## API Endpointleri

- `GET /api/components`: Tüm bileşenleri getirir
- `POST /api/components`: Yeni bileşenleri kaydeder
- `GET /api/email-data`: Tüm e-posta verilerini getirir
- `POST /api/email-data`: Yeni e-posta verilerini kaydeder

## Dosya Yapısı

- `data.json`: Bileşenlerin saklandığı JSON dosyası
- `emailData.json`: E-posta verilerinin saklandığı JSON dosyası

## Kurulum

## `cd backend`

### `npm install`

## Projeyi Başlatma

### `node server.js`