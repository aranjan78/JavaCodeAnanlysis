# JavaCodeAnanlysis
This repositoty contains two programs
1. JavaFileIntelligence.ipynb (jupyter notebook)
2. JavaSpring2Express.py (python script)

**JavaFileIntelligence.ipynb** scan through a java spring project directory and extract below details. Result is saved in file 'java_ee_analysis.json
To Run of Java code analysis: Fill PROJECT_PATH and GROQ_API_KEY in function run_with_predefined_paths() and run the notebook
- A high level overview of project
- Each class description with Catagoty out of one below 
            'Controller',
            'Service',
            'DAO',
            'Entity',
            'Component',
            'Configuration'
- Each method in the Class with
           name
           signature
           description
           complexity - Low/Medium/High/Very High

  
**JavaSpring2Express.py** scan a java spring project directory, find controller / service / DAO classes and generate equivalent code in for express.js framework other types of files will be ignored.
Run it as stanalone python script, it will ask for source java directory and destination directory to generate express.js router / services / models code under destination.
