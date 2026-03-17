/**
 * Extra Networks (LoRA, checkpoints, etc.)
 * LoRA can be used in prompts: <lora:name:0.8>
 */
export default function ExtraNetworks() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Extra Networks</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Extra networks like LoRA can be used directly in your prompts. Add them using the format:
        </p>
        <div className="rounded-lg p-4 font-mono text-sm" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
          &lt;lora:model_name:0.8&gt;
        </div>
        <p className="text-sm mt-4" style={{ color: 'var(--color-text-muted)' }}>
          Replace <strong style={{ color: 'var(--color-text)' }}>model_name</strong> with your LoRA filename (without extension)
          and adjust the weight (0.8) as needed.
        </p>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-dim)' }}>
          Thumbnails and metadata are available via <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>/sd_extra_networks/</code> API when using the backend with extensions loaded.
        </p>
      </div>
    </div>
  )
}
