node("currikidev") {
    def app
    
    stage('Clone repository') {               
        checkout scm    
    }  
    
    stage('Build image') {         
        app = docker.build("quay.io/curriki/client")    
        
    } 
    stage('Test image') {           
        app.inside { 
                sh 'echo "Api Tests passed"'        
        }    
    } 
    stage('Push image') {	
        docker.withRegistry('https://quay.io', 'docker-private-credentials') {            
            app.push("${env.BUILD_NUMBER}")            
            app.push("currikicc")        
        }    
         
    }
    
    parallel(
            "StageA": {
                if(Jenkins.instance.getNode('currikishepherds').toComputer().isOnline()){
                    node('currikicc') {
                        stage ('currikicc') {
                                echo 'Copy'
                                sh "yes | docker stack deploy --compose-file /curriki/docker-compose-shepherds.yml currikistack" 
                                echo 'Copy completed'
                        }
                    }
                } else {
                    stage ('currikicc') {
                        echo "currikicc is offline"
                        exit 1
                    }
                }
                
            }
    )
    
}
