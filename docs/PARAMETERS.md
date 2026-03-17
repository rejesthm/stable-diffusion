# Generation Parameters

Short reference for the main inputs used when generating images.

---

## Model

The Stable Diffusion checkpoint (AI model) to use. Each model has a different style and training. Place `.ckpt` or `.safetensors` files in `models/Stable-diffusion/` to add more.

---

## Prompt

The text description of the image you want. Be specific: include subject, style, lighting, and composition.

**Example:** `a cat wearing a hat, oil painting, warm lighting`

---

## Negative Prompt

What to avoid in the image. List undesired elements, styles, or artifacts.

**Example:** `blurry, low quality, deformed, watermark`

---

## Steps

**What it does:** Number of denoising steps. More steps = more refinement, but slower.

**Typical range:** 20–30  
**Higher (40–50):** Smoother, more detailed, slower  
**Lower (15–20):** Faster, may be less refined

---

## CFG Scale (Classifier-Free Guidance)

**What it does:** How closely the output follows the prompt. Higher = stricter adherence to the prompt.

**Typical range:** 7–9  
**Higher (10–15):** Stronger prompt adherence, can look over-saturated or distorted  
**Lower (5–7):** More creative, less literal

---

## Sampler

The algorithm used for denoising. Different samplers give different speed/quality tradeoffs.

| Sampler | Notes |
|---------|-------|
| **Euler** | Fast, good default |
| **Euler a** | Euler ancestral, more variation |
| **DPM++ 2M** | Good quality, moderate speed |
| **DPM++ 2M Karras** | DPM++ with Karras noise schedule |
| **DDIM** | Fewer steps needed, deterministic |
| **LMS** | Older, stable |

---

## Seed

**What it does:** Random seed for reproducibility. Same seed + same settings = same image.

**-1:** Random seed each time (different result every run)  
**Fixed number:** Repeat the same image by reusing the seed

---

## Width & Height

Output image size in pixels. Must be multiples of 8 (e.g. 512, 768, 1024).

**Common sizes:** 512×512, 768×768, 1024×1024

---

## Denoising Strength (Img2Img only)

**What it does:** How much the output can differ from the input image. 0 = keep input; 1 = fully regenerate.

**Typical range:** 0.5–0.75  
**Lower:** Keeps more of the original image  
**Higher:** More change, more creative
