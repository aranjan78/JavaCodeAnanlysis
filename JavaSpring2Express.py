import os
import json
from pathlib import Path
from typing import Dict, List, Optional
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class JavaToExpressConverter:
    def __init__(self, model_name: str = "meta-llama/llama-4-maverick-17b-128e-instruct", temperature: float = 0.1):
        """Initialize the converter with Groq LLM"""
        self.llm = ChatGroq(
            model_name=model_name,
            temperature=temperature,
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        self.setup_prompts()
        
    def setup_prompts(self):
        """Setup conversion prompts for different Java types"""
        
        # Controller conversion prompt
        self.controller_prompt = PromptTemplate(
            input_variables=["java_code", "file_path"],
            template="""
            Convert this Java Spring Boot Controller to Express.js router.
            
            CONVERSION RULES:
            1. @RestController → express.Router()
            2. @RequestMapping → router.METHOD()
            3. @GetMapping → router.get()
            4. @PostMapping → router.post()
            5. @PutMapping → router.put()
            6. @DeleteMapping → router.delete()
            7. @PathVariable → req.params
            8. @RequestParam → req.query
            9. @RequestBody → req.body
            10. ResponseEntity → res.status().json()
            
            Return ONLY the Express.js router code without explanations.
            
            File: {file_path}
            Java Code:
            {java_code}
            """
        )
        
        # Service conversion prompt
        self.service_prompt = PromptTemplate(
            input_variables=["java_code", "file_path"],
            template="""
            Convert this Java Service class to Express.js service module.
            
            CONVERSION RULES:
            1. Remove @Service annotation
            2. Convert Java methods to JavaScript functions
            3. Use async/await for async operations
            4. Export functions using module.exports
            5. Remove Spring-specific dependencies
            
            Return ONLY the Express.js service module code without explanations.
            
            File: {file_path}
            Java Code:
            {java_code}
            """
        )
        
        # DAO/Repository conversion prompt
        self.dao_prompt = PromptTemplate(
            input_variables=["java_code", "file_path"],
            template="""
            Convert this Java DAO/Repository to Express.js data access module.
            
            CONVERSION RULES:
            1. Remove @Repository annotation
            2. Convert Spring Data JPA methods to database queries
            3. Use async/await for database operations
            4. Export functions using module.exports
            5. Assume Mongoose for MongoDB or any suitable database library
            
            Return ONLY the Express.js data access module code without explanations.
                        
            File: {file_path}
            Java Code:
            {java_code}
            """
        )
        
        self.controller_chain = LLMChain(llm=self.llm, prompt=self.controller_prompt)
        self.service_chain = LLMChain(llm=self.llm, prompt=self.service_prompt)
        self.dao_chain = LLMChain(llm=self.llm, prompt=self.dao_prompt)
    
    def detect_java_type(self, file_path: str, content: str) -> str:
        """Detect if file is Controller, Service, or DAO"""
        filename = file_path.lower()
        content_lower = content.lower()
        
        if 'controller' in filename or '@restcontroller' in content_lower or '@controller' in content_lower:
            return 'controller'
        elif 'service' in filename or '@service' in content_lower:
            return 'service'
        elif ('repository' in filename or 'dao' in filename or 
              '@repository' in content_lower or 'jparepository' in content_lower):
            return 'dao'
        else:
            return 'other'
    
    def read_java_file(self, file_path: str) -> Optional[str]:
        """Read Java file content"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            return None
    
    def find_java_files(self, project_path: str) -> List[str]:
        """Find all Java files in project"""
        java_files = []
        for root, _, files in os.walk(project_path):
            for file in files:
                if file.endswith('.java'):
                    java_files.append(os.path.join(root, file))
        return java_files
    
    def convert_java_file(self, java_file_path: str) -> Optional[Dict]:
        """Convert a single Java file"""
        content = self.read_java_file(java_file_path)
        if not content:
            return None
        
        file_type = self.detect_java_type(java_file_path, content)
        
        try:
            if file_type == 'controller':
                converted_code = self.controller_chain.run({
                    'java_code': content,
                    'file_path': java_file_path
                })
                target_path = self.get_target_path(java_file_path, 'routes')
                
            elif file_type == 'service':
                converted_code = self.service_chain.run({
                    'java_code': content,
                    'file_path': java_file_path
                })
                target_path = self.get_target_path(java_file_path, 'services')
                
            elif file_type == 'dao':
                converted_code = self.dao_chain.run({
                    'java_code': content,
                    'file_path': java_file_path
                })
                target_path = self.get_target_path(java_file_path, 'models')
                
            else:
                print(f"Skipping non-Controller/Service/DAO file: {java_file_path}")
                return None
            
            return {
                'original_path': java_file_path,
                'converted_code': converted_code.strip(),
                'file_type': file_type,
                'target_path': target_path
            }
            
        except Exception as e:
            print(f"Error converting {java_file_path}: {e}")
            return None
    
    def get_target_path(self, java_path: str, target_dir: str) -> str:
        """Generate target path for converted file"""
        filename = os.path.basename(java_path)
        # Convert MyService.java to myService.js or my-service.js
        js_filename = filename.replace('.java', '.js')
        
        # Simple naming conversion (optional: add more sophisticated conversion)
        if 'Controller' in filename:
            js_filename = js_filename.replace('Controller', 'Routes')
        elif 'Service' in filename:
            js_filename = js_filename.replace('Service', 'Service')
        elif 'Repository' in filename:
            js_filename = js_filename.replace('Repository', 'Model')
        elif 'DAO' in filename:
            js_filename = js_filename.replace('DAO', 'Model')
        
        return os.path.join(target_dir, js_filename)
    
      
    def convert_project(self, java_project_path: str, output_path: str):
        """Convert Java project to Express.js"""
        print(f"🔍 Scanning Java project: {java_project_path}")
        
        if not os.path.exists(java_project_path):
            print("❌ Error: Java project path doesn't exist!")
            return
        
        if not os.getenv("GROQ_API_KEY"):
            print("❌ Error: GROQ_API_KEY environment variable not set!")
            return
        
        # Create output directory structure
        os.makedirs(output_path, exist_ok=True)
        os.makedirs(os.path.join(output_path, 'routes'), exist_ok=True)
        os.makedirs(os.path.join(output_path, 'services'), exist_ok=True)
        os.makedirs(os.path.join(output_path, 'models'), exist_ok=True)
        
        
        # Find and convert Java files
        java_files = self.find_java_files(java_project_path)
        print(f"📁 Found {len(java_files)} Java files")
        
        conversion_results = []
        converted_count = 0
        
        for java_file in java_files:
            print(f"🔄 Converting: {os.path.basename(java_file)}")
            result = self.convert_java_file(java_file)
            
            if result:
                converted_count += 1
                conversion_results.append(result)
                
                # Save converted file
                target_file = os.path.join(output_path, result['target_path'])
                os.makedirs(os.path.dirname(target_file), exist_ok=True)
                
                with open(target_file, 'w') as f:
                    f.write(result['converted_code'])
                
                print(f"✅ Converted: {result['file_type']} -> {result['target_path']}")
        
        # Generate report
        self.generate_report(conversion_results, output_path)
        
        print(f"\n🎉 Conversion complete!")
        print(f"📊 Converted {converted_count}/{len(java_files)} files")
        print(f"📂 Output: {output_path}")
        print("\n🚀 Next steps:")
        print("1. Run: npm install")
        print("2. Run: npm run dev")
        print("3. Connect your database")
        print("4. Test the endpoints")
    
    def generate_report(self, results: List[Dict], output_path: str):
        """Generate conversion report"""
        report = {
            "total_files_converted": len(results),
            "by_type": {
                "controller": len([r for r in results if r['file_type'] == 'controller']),
                "service": len([r for r in results if r['file_type'] == 'service']),
                "dao": len([r for r in results if r['file_type'] == 'dao'])
            },
            "converted_files": [
                {
                    "original": os.path.basename(r['original_path']),
                    "type": r['file_type'],
                    "target": r['target_path']
                } for r in results
            ]
        }
        
        with open(os.path.join(output_path, 'conversion-report.json'), 'w') as f:
            json.dump(report, f, indent=2)

def main():
    """Main function"""
    print("🚀 Java Spring Boot to Express.js Converter")
    print("=" * 50)
    
    # Get input paths
    java_path = input("Enter path to Java project: ").strip()
    output_path = input("Enter output path (default: ./converted-express): ").strip()
    
    if not output_path:
        output_path = "./converted-express"
    
    # Initialize and run converter
    converter = JavaToExpressConverter()
    converter.convert_project(java_path, output_path)

if __name__ == "__main__":
    main()