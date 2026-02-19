#!/usr/bin/env python3
"""
HeySalad Model Training Script
Fine-tunes Llama 2 7B using LoRA for HeySalad-specific tasks
"""

import os
import torch
from datetime import datetime
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset
import wandb

# Configuration
CONFIG = {
    "base_model": "meta-llama/Llama-2-7b-chat-hf",
    "output_dir": "./heysalad-7b",
    "dataset_path": "./data/training_data.jsonl",
    "model_name": "heysalad-7b",
    "version": "v0.1.0",

    # LoRA parameters
    "lora_r": 16,
    "lora_alpha": 32,
    "lora_dropout": 0.05,
    "lora_target_modules": ["q_proj", "v_proj", "k_proj", "o_proj"],

    # Training parameters
    "num_epochs": 3,
    "batch_size": 4,
    "gradient_accumulation_steps": 4,
    "learning_rate": 2e-4,
    "max_length": 512,
    "warmup_steps": 50,

    # Optimization
    "use_8bit": True,
    "use_flash_attention": False,  # Set to True if available

    # Logging
    "use_wandb": False,  # Set to True and add WANDB_API_KEY
    "logging_steps": 10,
    "save_steps": 100,
    "eval_steps": 100,
}

def print_banner():
    """Print HeySalad training banner"""
    print("=" * 60)
    print("   🥗 HeySalad Model Training")
    print(f"   Model: {CONFIG['model_name']}")
    print(f"   Version: {CONFIG['version']}")
    print(f"   Base: {CONFIG['base_model']}")
    print("=" * 60)

def setup_wandb():
    """Initialize Weights & Biases for experiment tracking"""
    if CONFIG["use_wandb"] and os.getenv("WANDB_API_KEY"):
        wandb.init(
            project="heysalad-model",
            name=f"{CONFIG['model_name']}-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            config=CONFIG
        )
        print("✅ Weights & Biases initialized")
    else:
        print("⚠️  Weights & Biases disabled")

def load_model_and_tokenizer():
    """Load base model and tokenizer"""
    print("\n📥 Loading base model and tokenizer...")

    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(CONFIG["base_model"])
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"

    # Load model with quantization
    model = AutoModelForCausalLM.from_pretrained(
        CONFIG["base_model"],
        load_in_8bit=CONFIG["use_8bit"],
        device_map="auto",
        torch_dtype=torch.float16,
    )

    # Prepare for training
    model = prepare_model_for_kbit_training(model)

    print(f"✅ Model loaded: {CONFIG['base_model']}")
    print(f"   Memory: {'8-bit' if CONFIG['use_8bit'] else '16-bit'}")
    print(f"   Device: {next(model.parameters()).device}")

    return model, tokenizer

def setup_lora(model):
    """Configure and apply LoRA"""
    print("\n🔧 Setting up LoRA...")

    lora_config = LoraConfig(
        r=CONFIG["lora_r"],
        lora_alpha=CONFIG["lora_alpha"],
        target_modules=CONFIG["lora_target_modules"],
        lora_dropout=CONFIG["lora_dropout"],
        bias="none",
        task_type="CAUSAL_LM"
    )

    model = get_peft_model(model, lora_config)

    # Print trainable parameters
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total_params = sum(p.numel() for p in model.parameters())
    trainable_percent = 100 * trainable_params / total_params

    print(f"✅ LoRA configured:")
    print(f"   Rank: {CONFIG['lora_r']}")
    print(f"   Alpha: {CONFIG['lora_alpha']}")
    print(f"   Trainable params: {trainable_params:,} ({trainable_percent:.2f}%)")
    print(f"   Total params: {total_params:,}")

    return model

def load_and_prepare_dataset(tokenizer):
    """Load and tokenize dataset"""
    print("\n📚 Loading dataset...")

    # Load dataset
    dataset = load_dataset('json', data_files={
        'train': CONFIG["dataset_path"]
    })

    print(f"✅ Dataset loaded: {len(dataset['train'])} examples")

    # Tokenize function
    def tokenize_function(examples):
        texts = []
        for messages in examples['messages']:
            # Apply chat template
            text = tokenizer.apply_chat_template(
                messages,
                tokenize=False,
                add_generation_prompt=False
            )
            texts.append(text)

        # Tokenize
        tokenized = tokenizer(
            texts,
            truncation=True,
            max_length=CONFIG["max_length"],
            padding="max_length",
            return_tensors=None,
        )

        # Set labels for language modeling
        tokenized["labels"] = tokenized["input_ids"].copy()

        return tokenized

    # Tokenize dataset
    print("🔄 Tokenizing dataset...")
    tokenized_dataset = dataset.map(
        tokenize_function,
        batched=True,
        remove_columns=dataset["train"].column_names,
        desc="Tokenizing"
    )

    print(f"✅ Dataset tokenized")

    return tokenized_dataset

def setup_training_args():
    """Configure training arguments"""
    print("\n⚙️  Setting up training arguments...")

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    output_dir = f"{CONFIG['output_dir']}-{timestamp}"

    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=CONFIG["num_epochs"],
        per_device_train_batch_size=CONFIG["batch_size"],
        gradient_accumulation_steps=CONFIG["gradient_accumulation_steps"],
        learning_rate=CONFIG["learning_rate"],
        logging_steps=CONFIG["logging_steps"],
        save_steps=CONFIG["save_steps"],
        evaluation_strategy="steps",
        eval_steps=CONFIG["eval_steps"],
        warmup_steps=CONFIG["warmup_steps"],
        fp16=True,
        optim="paged_adamw_8bit",
        report_to="wandb" if CONFIG["use_wandb"] else "none",
        save_total_limit=3,
        load_best_model_at_end=True,
    )

    print(f"✅ Training arguments configured")
    print(f"   Output: {output_dir}")
    print(f"   Epochs: {CONFIG['num_epochs']}")
    print(f"   Batch size: {CONFIG['batch_size']}")
    print(f"   Learning rate: {CONFIG['learning_rate']}")

    return training_args

def train_model(model, tokenizer, dataset, training_args):
    """Train the model"""
    print("\n🚀 Starting training...")
    print("=" * 60)

    # Data collator
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False,
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        data_collator=data_collator,
    )

    # Train!
    train_result = trainer.train()

    print("=" * 60)
    print("✅ Training complete!")
    print(f"   Training loss: {train_result.training_loss:.4f}")
    print(f"   Training time: {train_result.metrics['train_runtime']:.2f}s")

    return trainer

def save_model(trainer, tokenizer):
    """Save the trained model"""
    print("\n💾 Saving model...")

    output_dir = trainer.args.output_dir

    # Save model
    trainer.model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)

    # Save config
    import json
    with open(f"{output_dir}/training_config.json", "w") as f:
        json.dump(CONFIG, f, indent=2)

    print(f"✅ Model saved to: {output_dir}")

    # Instructions for next steps
    print("\n" + "=" * 60)
    print("🎉 HeySalad Model Training Complete!")
    print("=" * 60)
    print("\n📝 Next steps:")
    print(f"   1. Test the model:")
    print(f"      python test_heysalad.py --model {output_dir}")
    print(f"   2. Deploy with vLLM:")
    print(f"      python -m vllm.entrypoints.openai.api_server --model {output_dir}")
    print(f"   3. Push to Hugging Face:")
    print(f"      python push_to_hub.py --model {output_dir}")
    print()

def main():
    """Main training pipeline"""
    print_banner()

    # Setup
    setup_wandb()

    # Load model and tokenizer
    model, tokenizer = load_model_and_tokenizer()

    # Setup LoRA
    model = setup_lora(model)

    # Load and prepare dataset
    dataset = load_and_prepare_dataset(tokenizer)

    # Setup training
    training_args = setup_training_args()

    # Train
    trainer = train_model(model, tokenizer, dataset, training_args)

    # Save
    save_model(trainer, tokenizer)

if __name__ == "__main__":
    main()
