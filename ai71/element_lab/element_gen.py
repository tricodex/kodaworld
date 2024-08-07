from typing import Optional
from pydantic import BaseModel
import json
import logging
from ..api import OpenAIAPI

class UIElement(BaseModel):
    html: str
    css: str
    javascript: str

class JSElementGenerator:
    def __init__(self):
        self.ai_api = OpenAIAPI()
        self.logger = self._setup_logger()

    def _setup_logger(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    async def _generate_element(self, system_message: str, user_prompt: str) -> UIElement:
        try:
            response = await self.ai_api.chat_completion([
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt}
            ], model="gpt-4o-mini")  # Assuming we're using the gpt-4o-mini model
            
            content = response['choices'][0]['message']['content']
            element_data = json.loads(content)
            return UIElement(**element_data)
        except json.JSONDecodeError as e:
            self.logger.error(f"Error decoding JSON response: {str(e)}")
            raise ValueError("Failed to generate UI element: Invalid JSON response")
        except Exception as e:
            self.logger.error(f"Unexpected error in element generation: {str(e)}")
            raise

    async def generate_button(self, label: str, style: str = "default", onClick: Optional[str] = None) -> UIElement:
        system_message = """
        You are an expert front-end developer specializing in creating reusable UI components. 
        Your task is to generate HTML, CSS (using Tailwind classes), and JavaScript for a button element.
        The output should be clean, accessible, and follow modern web development best practices.
        """

        user_prompt = f"""
        Create a button with the following specifications:
        - Label: "{label}"
        - Style: {style} (options: default, primary, secondary, danger)
        - onClick functionality: {onClick if onClick else "None"}

        Return a JSON object with the following structure:
        {{
            "html": "The HTML markup for the button",
            "css": "Any additional custom CSS (if needed, otherwise an empty string)",
            "javascript": "JavaScript code for the button's functionality"
        }}

        Use Tailwind CSS classes for styling. Ensure the button is accessible and works well on different devices.
        If an onClick function is specified, include it in the JavaScript.
        """

        return await self._generate_element(system_message, user_prompt)

    async def generate_card(self, title: str, content: str, image_url: Optional[str] = None) -> UIElement:
        system_message = """
        You are an expert front-end developer specializing in creating reusable UI components. 
        Your task is to generate HTML, CSS (using Tailwind classes), and JavaScript for a card component.
        The output should be clean, accessible, and follow modern web development best practices.
        """

        user_prompt = f"""
        Create a card component with the following specifications:
        - Title: "{title}"
        - Content: "{content}"
        - Image URL: {image_url if image_url else "None"}

        Return a JSON object with the following structure:
        {{
            "html": "The HTML markup for the card",
            "css": "Any additional custom CSS (if needed, otherwise an empty string)",
            "javascript": "JavaScript code for any interactive features (if needed, otherwise an empty string)"
        }}

        Use Tailwind CSS classes for styling. Ensure the card is responsive and accessible.
        If an image URL is provided, include an img element in the card.
        Add a subtle hover effect to the card.
        """

        return await self._generate_element(system_message, user_prompt)

    async def generate_modal(self, title: str, content: str, trigger_button_text: str) -> UIElement:
        system_message = """
        You are an expert front-end developer specializing in creating reusable UI components. 
        Your task is to generate HTML, CSS (using Tailwind classes), and JavaScript for a modal component.
        The output should be clean, accessible, and follow modern web development best practices.
        """

        user_prompt = f"""
        Create a modal component with the following specifications:
        - Title: "{title}"
        - Content: "{content}"
        - Trigger button text: "{trigger_button_text}"

        Return a JSON object with the following structure:
        {{
            "html": "The HTML markup for the modal and its trigger button",
            "css": "Any additional custom CSS (if needed, otherwise an empty string)",
            "javascript": "JavaScript code to handle opening, closing, and accessibility of the modal"
        }}

        Use Tailwind CSS classes for styling. Ensure the modal is accessible, can be closed by clicking outside or pressing ESC key.
        Include a close button within the modal.
        The JavaScript should handle showing/hiding the modal and managing focus for accessibility.
        """

        return await self._generate_element(system_message, user_prompt)

# Usage example
async def main():
    generator = JSElementGenerator()

    try:
        # Generate a button
        button = await generator.generate_button("Click me!", style="primary", onClick="alert('Button clicked!')")
        print("Button Element:")
        print(json.dumps(button.dict(), indent=2))

        # Generate a card
        card = await generator.generate_card(
            title="Sample Card", 
            content="This is a sample card with some content.",
            image_url="https://example.com/image.jpg"
        )
        print("\nCard Element:")
        print(json.dumps(card.dict(), indent=2))

        # Generate a modal
        modal = await generator.generate_modal(
            title="Information", 
            content="This is important information in a modal.",
            trigger_button_text="Open Modal"
        )
        print("\nModal Element:")
        print(json.dumps(modal.dict(), indent=2))

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())