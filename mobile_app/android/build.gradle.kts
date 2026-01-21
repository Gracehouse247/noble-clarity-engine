allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

// Build directory redirection removed to use standard build/ directory


subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
