
const fileInput = document.getElementById('fileInput')
const thumbnailsContainer = document.getElementById('thumbnails')
const splitBtn = document.getElementById('splitBtn')
const downloadBtn = document.getElementById('downloadBtn')

let images = []
let splitImages = []

fileInput.addEventListener('change', (e) => {
	const files = Array.from(e.target.files)
	images = []
	splitImages = []
	thumbnailsContainer.innerHTML = ''
	splitBtn.disabled = false
	downloadBtn.disabled = true

	files.forEach((file, index) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			const img = new Image()
			img.src = e.target.result
			img.onload = () => {
				images.push(img)
				const thumbnailContainer = document.createElement('div')
				thumbnailContainer.classList.add('thumbnail-container')
				const thumbnail = img.cloneNode()
				thumbnail.classList.add('thumbnail')
				thumbnailContainer.appendChild(thumbnail)
				const imageName = document.createElement('div')
				imageName.classList.add('image-name')
				imageName.textContent = `Image ${index + 1}`
				thumbnailContainer.appendChild(imageName)
				thumbnailsContainer.appendChild(thumbnailContainer)
			}
		}
		reader.readAsDataURL(file)
	})
})

splitBtn.addEventListener('click', () => {
	splitImages = []
	thumbnailsContainer.innerHTML = ''

	images.forEach((img, index) => {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		const halfWidth = img.width / 2

		canvas.width = halfWidth
		canvas.height = img.height

		// Left half
		ctx.drawImage(img, 0, 0, halfWidth, img.height, 0, 0, halfWidth, img.height)
		splitImages.push(canvas.toDataURL())

		// Right half
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(img, halfWidth, 0, halfWidth, img.height, 0, 0, halfWidth, img.height)
		splitImages.push(canvas.toDataURL())

		// Create thumbnails for split images
		const thumbnailContainer = document.createElement('div')
		thumbnailContainer.classList.add('thumbnail-container')

		const leftThumbnail = new Image()
		leftThumbnail.src = splitImages[splitImages.length - 2]
		leftThumbnail.classList.add('thumbnail')
		thumbnailContainer.appendChild(leftThumbnail)

		const rightThumbnail = new Image()
		rightThumbnail.src = splitImages[splitImages.length - 1]
		rightThumbnail.classList.add('thumbnail')
		thumbnailContainer.appendChild(rightThumbnail)

		const imageName = document.createElement('div')
		imageName.classList.add('image-name')
		imageName.textContent = `Image ${index + 1} (Split)`
		thumbnailContainer.appendChild(imageName)

		thumbnailsContainer.appendChild(thumbnailContainer)
	})

	downloadBtn.disabled = false
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

downloadBtn.addEventListener('click', async () => {
	const imagesPerGroup = 2
	let groupIndex = 1
	let imageIndexInGroup = 1
	for (const [index, item] of splitImages.entries()) {
		const link = document.createElement('a')
		link.href = item

		const mimeType = item.split(';')[0].split(':')[1]
		const fileExtension = mimeType.split('/')[1]

		link.download = `image_${groupIndex}-${imageIndexInGroup}.${fileExtension}`

		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		imageIndexInGroup++

		if (imageIndexInGroup > imagesPerGroup) {
			imageIndexInGroup = 1
			groupIndex++
		}

		await delay(110)
	}
});