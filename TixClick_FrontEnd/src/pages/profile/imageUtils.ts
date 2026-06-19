/**
 * Tạo và trả về một ảnh đã được cắt từ ảnh gốc
 * @param imageSrc - Đường dẫn hoặc URL của ảnh gốc
 * @param pixelCrop - Vùng cắt (x, y, width, height)
 * @param rotation - Góc xoay (tính bằng độ)
 * @returns Promise<Blob> - Blob chứa ảnh đã cắt
 */
export const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation: number = 0
  ): Promise<Blob | null> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
  
    if (!ctx) {
      return null
    }
  
    // Thiết lập kích thước canvas bằng với kích thước vùng cắt
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
  
    // Vẽ ảnh đã cắt lên canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  
    // Lưu trạng thái canvas
    ctx.save()
  
    // Di chuyển canvas để vùng cắt nằm ở vị trí (0,0)
    ctx.translate(-pixelCrop.x, -pixelCrop.y)
  
    // Xoay ảnh nếu cần
    if (rotation !== 0) {
      // Tính toán tâm xoay
      const centerX = image.width / 2
      const centerY = image.height / 2
  
      // Di chuyển canvas đến tâm xoay
      ctx.translate(centerX, centerY)
      // Xoay canvas
      ctx.rotate((rotation * Math.PI) / 180)
      // Di chuyển canvas trở lại vị trí ban đầu
      ctx.translate(-centerX, -centerY)
    }
  
    // Vẽ ảnh gốc lên canvas
    ctx.drawImage(image, 0, 0)
  
    // Khôi phục trạng thái canvas
    ctx.restore()
  
    // Chuyển đổi canvas thành blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.95) // Chất lượng 95%
    })
  }
  
  /**
   * Tạo một đối tượng Image từ URL
   * @param url - URL của ảnh
   * @returns Promise<HTMLImageElement> - Đối tượng Image đã tải
   */
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.crossOrigin = 'anonymous' // Để tránh lỗi CORS
      image.src = url
    })
  