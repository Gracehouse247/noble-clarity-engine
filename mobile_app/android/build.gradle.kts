allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newRootDir = file("C:/temp/noble_build")
rootProject.layout.buildDirectory.value(rootProject.objects.directoryProperty().apply { set(newRootDir) })

subprojects {
    val newBuildDir = file("C:/temp/noble_build/${project.name}")
    project.layout.buildDirectory.value(project.objects.directoryProperty().apply { set(newBuildDir) })
}

subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
