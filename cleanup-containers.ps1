# cleanup-containers.ps1

# Get all container IDs
$containers = docker ps -aq
$images = docker images -q | Sort-Object -Unique

if ($containers) {
    Write-Host "Stopping containers..."
    docker stop $containers | Out-Null

    Write-Host "Removing containers..."
    docker rm $containers | Out-Null

    Write-Host "All containers stopped and removed."
} else {
    Write-Host "No containers to stop or remove."
}
if ($images.Count -eq 0) {
    Write-Output "No Docker images found."
} else {
    Write-Output "Removing all Docker images..."
    docker rmi -f $images
}
Write-Output "Cleaning up unused images and cache..."
docker system prune --all --volumes --force
Write-Output "Finished Cleaning up unused images and cache."
