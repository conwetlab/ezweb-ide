from django.http import HttpResponse, HttpRequest, HttpResponseBadRequest
from file.fileManager import FileManager
from file.wgtPackageUtils import WgtPackageUtils
from django.contrib.auth.decorators import login_required
from django.core.servers.basehttp import FileWrapper
import os
import glob

@login_required
def manageFile(request,route):
    response = HttpResponse()
    x = FileManager()
    if request.method == 'GET':
        response.write(x.getFile(request.user.username,route))
    elif request.method == 'POST':
        response.write(x.saveFiles(request.user.username,route,request.POST.__getitem__('filesToSave')))
    else:
        response.write("This URI is only available for GET and POST petitions.")
    return response

@login_required
def renameFile(request,route):
    if request.method == 'POST':
        response = HttpResponse()
        x = FileManager()
        response.write(x.renameFile(request.user.username,route,request.POST.__getitem__('newId')))
    else:
        response = HttpResponseBadRequest()
        response.write("You cannot send a GET to this URI.")
    return response

@login_required
def deleteFile(request,route):
    if request.method == 'POST':
        response = HttpResponse()
        x = FileManager()
        response.write(x.deleteFiles(request.user.username,route))
    else:
        response = HttpResponseBadRequest()
        response.write("You cannot send a GET to this URI.")
    return response

@login_required
def listProjects(request):
    response = HttpResponse()
    x = FileManager()
    if request.method == 'GET':
        response.write(x.getProjects(request.user.username))
    else:
        response.write("<h3>No puedes listar los proyectos</h3>")
        response.write("Se ha recibido un post")
    return response

@login_required
def listTemplates(request,route):
    response = HttpResponse()
    x = FileManager()
    if request.method == 'GET':
        response.write(x.getTemplates(request.user.username,route))
    else:
        response = HttpResponseBadRequest()
        response.write("This URI is only available for GET petitions.")
    return response

@login_required
def listImages(request,route):
    response = HttpResponse()
    x = FileManager()
    if request.method == 'GET':
        response.write(x.getImages(request.user.username,route))
    else:
        response = HttpResponseBadRequest()
        response.write("This URI is only available for GET petitions.")
    return response

@login_required
def listDirs(request,route):
    response = HttpResponse()
    x = FileManager()
    if request.method == 'GET':
        response.write(x.getDirs(request.user.username,route))
    else:
        response = HttpResponseBadRequest()
        response.write("This URI is only available for GET petitions.")
    return response

@login_required
def saveImage(request):
    response = HttpResponse()
    x = FileManager()
    if request.method == 'POST':
        response.write(x.saveImage(request.user.username,request.POST["nameInputImage"],request.POST["dirSelectImage"],request.FILES["inputFileImage"]))
    else:
        response = HttpResponseBadRequest()
        response.write("This URI is only available for POST petitions.")
    return response

@login_required
def importFile(request):
    response = HttpResponse()
    x = FileManager()
    if request.method == 'POST':
        response.write(x.uploadFile(request.user.username,request.POST["importNameInput"],request.POST["dialogImportSelectType"],request.POST["importRoute"],request.FILES["importFileInput"]))
    else:
        response = HttpResponseBadRequest()
        response.write("This URI is only available for POST petitions.")
    return response

@login_required
def packGadget(request,route):
    x = FileManager()
    p = WgtPackageUtils()
    if request.method == 'POST':
        templateContent = "<? xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        templateContent += "<widget xmlns=\"http://www.w3.org/ns/widgets/\"\n"
        templateContent += "\tid=\""+request.POST["wgtTemplate"]+"\"\n"
        templateContent += "\tname=\""+request.POST["wgtName"]+"\"\n"
        templateContent += "\tversion=\""+request.POST["wgtVersion"]+"\"\n"
        templateContent += "\tvendor=\""+request.POST["wgtVendor"]+"\"/>"
        currentDir = os.getcwd()
        os.chdir("resources/Projects/"+request.user.username)
        oldPackages = glob.glob("*.wgt")
        for i in oldPackages:
            os.remove(i)
        p.create(route,request.POST["wgtName"],templateContent,request.POST["wgtTemplateName"]+'.xml')
        wrapper = FileWrapper(file(request.POST["wgtName"]+'.wgt'))
        response = HttpResponse()
        response.write("resources/Projects/"+request.user.username+"/"+request.POST["wgtName"]+".wgt")
        os.chdir(currentDir)
        return response
    else:
        response = HttpResponseBadRequest()
        response.write("This URI is only available for POST petitions.")
        return response;
