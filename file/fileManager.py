from file.models import File
import json
import os

class FileManager:

# Public methods

    # returns the content of a file
    def getFile(self,user,text):
        separator = text.rfind('/')
        try:
            if separator != -1 :
                rawFile = File.objects.filter(parent=user+'/'+text[:separator]).filter(name=text[(separator+1):])[0]
                if rawFile.getType() == u'dir':
                    mixedList = File.objects.filter(parent=user+'/'+text)
                    dirsList = mixedList.filter(fileType=u'dir')
                    templatesList = mixedList.filter(fileType=u'template')
                    codesList = mixedList.filter(fileType=u'code')
                    imagesList = mixedList.filter(fileType=u'image')
                    otherList = mixedList.filter(fileType=u'other')
                    structure = []
                    for f in dirsList:
                        structure.append(f.getFile())
                    for f in templatesList:
                        structure.append(f.getFile())
                    for f in codesList:
                        structure.append(f.getFile())
                    for f in imagesList:
                        structure.append(f.getFile())
                    for f in otherList:
                        structure.append(f.getFile())
                    return json.JSONEncoder().encode(structure)
                else:
                    if rawFile.getType() != u'image' and rawFile.getType() != u'other':
                        c = open('resources/Projects/'+user+'/'+text)
                        content = c.read()
                        response = {'id': rawFile.getName(), 'parent': text[:separator], 'type': rawFile.getType(), 'text': content, 'syntax': rawFile.getSyntax()}
                        return json.JSONEncoder().encode(response)
                    else:
                        return "You cannot get the files through this URI."
            else:
                #is a project
                mixedList = File.objects.filter(parent=user+'/'+text)
                dirsList = mixedList.filter(fileType=u'dir')
                templatesList = mixedList.filter(fileType=u'template')
                codesList = mixedList.filter(fileType=u'code')
                imagesList = mixedList.filter(fileType=u'image')
                otherList = mixedList.filter(fileType=u'other')
                structure = []
                for f in dirsList:
                    structure.append(f.getFile())
                for f in templatesList:
                    structure.append(f.getFile())
                for f in codesList:
                    structure.append(f.getFile())
                for f in imagesList:
                    structure.append(f.getFile())
                for f in otherList:
                    structure.append(f.getFile())
                return json.JSONEncoder().encode(structure)
        except:
            response = {'error': "The file "+text+" could not be matched."}
            return json.JSONEncoder().encode(response)

    #renames the file of the route
    def renameFile(self,user,text,newName):
        separator = text.rfind('/')
        try:
            if separator != -1 :
                oldFileList = File.objects.filter(parent=user+'/'+text[:separator]).filter(name=text[(separator+1):])
                if (len(oldFileList)==0):
                    return "error"
                else:
                    newFileList = File.objects.filter(parent=user+'/'+text[:separator]).filter(name=newName)
                    if (len(newFileList)==0):
                        newFile = oldFileList[0]
                        newFile.name = newName
                        newFile.save()
                        os.rename('resources/Projects/'+user+'/'+text,'resources/Projects/'+newFile.parent+'/'+newName)
                        if newFile.fileType==u'dir':
                            directSiblings = File.objects.filter(parent=user+'/'+text)
                            for f in directSiblings:
                                f.parent = user+'/'+text[:(separator+1)]+newName
                                f.save()
                            indirectSiblings = File.objects.filter(parent__startswith=user+'/'+text+'/')
                            for f2 in indirectSiblings:
                                f2.parent = f2.parent.replace(user+'/'+text,user+'/'+text[:(separator+1)]+newName,1)
                                f2.save()
                        return "ok"
                    else:
                        return "error"
            else:
                #is a project
                oldFileList = File.objects.filter(parent=user).filter(name=text)
                if (len(oldFileList)==0):
                    return "error"
                else:
                    newFileList = File.objects.filter(parent=user).filter(name=newName)
                    if (len(newFileList)==0):
                        newFile = oldFileList[0]
                        newFile.name = newName
                        newFile.save()
                        os.rename('resources/Projects/'+user+'/'+text,'resources/Projects/'+user+'/'+newName)
                        directSiblings = File.objects.filter(parent=user+'/'+text)
                        for f in directSiblings:
                            f.parent = user+'/'+newName
                            f.save()
                        indirectSiblings = File.objects.filter(parent__startswith=user+'/'+text+'/')
                        for f2 in indirectSiblings:
                            f2.parent = f2.parent.replace(user+'/'+text,user+'/'+newName,1)
                            f2.save()
                        return "ok"
                    else:
                        return "error"
        except IndexError:
            return "The file could not be matched "+text[:separator]+" / "+text[(separator+1):]

    #manages the saving process of multiple files
    def saveFiles(self,user,text,files):
        filesList = json.JSONDecoder().decode(files)
        if len(filesList)==0:
            return json.JSONEncoder().encode({})
        else:
            done = True
            for f in filesList:
                done = True and self.__saveFile(user,f)
            result = {}
            result['accomplished'] = done
            return json.JSONEncoder().encode(result)

    #manages the process of deleting a file
    def deleteFiles(self,user,text):
        separator = text.rfind('/')
        if separator != -1 :
            rawFile = File.objects.filter(parent=user+'/'+text[:separator]).filter(name=text[(separator+1):])
            if len(rawFile)==0:
                return "error"
            else:
                if rawFile[0].fileType == u'dir':
                    rawFile.delete()
                    directSiblings = File.objects.filter(parent__startswith=user+'/'+text)
                    for f in directSiblings:
                        self.deleteFiles(user,f.parent[f.parent.find('/')+1:]+'/'+f.name)
                        f.delete()
                    os.rmdir('resources/Projects/'+user+'/'+text)
                    return "ok"
                else:
                    rawFile.delete()
                    os.remove('resources/Projects/'+user+'/'+text)
                    return "ok"
        else:
            projectFile = File.objects.filter(parent=user).filter(name=text)
            if len(projectFile)==1:
                projectFile[0].delete()
                directSiblings = File.objects.filter(parent__startswith=user+'/'+text)
                for f in directSiblings:
                    self.deleteFiles(user,f.parent[f.parent.find('/')+1:]+'/'+f.name)
                    f.delete()
                os.rmdir('resources/Projects/'+user+'/'+text)
                return "ok"
            else:
                return "error"

    #returns the projects of a user
    def getProjects(self,user):
        try:
            rawProjects = File.objects.filter(parent=user)
            projects = []
            for p in rawProjects:
                projects.append({'id': p.getName()})
            return json.JSONEncoder().encode(projects)
        except IndexError:
            return "The user "+user+" does not exist."

    #returns the images in a route
    def getImages(self,user,route):
        try:
            rawImages = File.objects.filter(parent__startswith=user+'/'+route).filter(fileType=u'image')
            images = []
            for i in rawImages:
                images.append({'id':i.__unicode__()[i.__unicode__().find('/')+1:]})
            return json.JSONEncoder().encode(images)
        except:
            return "Unable to get images for the project"

    #returns the templates in a route
    def getTemplates(self,user,route):
        try:
            rawTemplates = File.objects.filter(parent__startswith=user+'/'+route).filter(fileType=u'template')
            templates = []
            for t in rawTemplates:
                templates.append({'id':t.__unicode__()[t.__unicode__().find('/')+1:]})
            return json.JSONEncoder().encode(templates)
        except:
            return "Unable to get templates for the project"

    #controls the process of saving a file in a route
    def uploadFile(self,user,name,fileType,route,files):
        try:
            if (route == ""):
                return "Error"
            elif (name == ""): #the name will be the original one from the file
                newName = files.name
                newImage = File(name=newName, fileType=fileType, parent=user+'/'+route)
                newImage.save() 
                f = open('resources/Projects/'+user+'/'+route+'/'+newName,'w',0664);
                for chunk in files.chunks():
                    f.write(chunk)
                f.close()
                response = []
                response.append({'parent':route, 'id': newName, 'type': fileType})
                return json.JSONEncoder().encode(response)
            else :
                newImage = File(name=name, fileType=fileType, parent=user+'/'+route)
                newImage.save() 
                f = open('resources/Projects/'+user+'/'+route+'/'+name,'w',0664);
                for chunk in files.chunks():
                    f.write(chunk)
                f.close()
                response = []
                response.append({'parent':route, 'id': name, 'type': fileType})
                return json.JSONEncoder().encode(response)
        except:
            return "Error"

    # Private methods

    #saves the content of a file edited through the IDE
    def __saveFile(self,user,fileToSave):
        try:
            if fileToSave[u'parent']!=None :
                rawFile = File.objects.filter(parent=user+'/'+fileToSave[u'parent']).filter(name=fileToSave[u'id'])
                if len(rawFile)==0:
                    if fileToSave[u'type'] == u'dir':
                        newFile = File(name=fileToSave[u'id'], fileType=fileToSave[u'type'], parent=user+'/'+fileToSave[u'parent'])
                        newFile.save()
                        os.mkdir('resources/Projects/'+user+'/'+fileToSave[u'parent']+'/'+fileToSave[u'id'],0775)
                    else:
                        newFile = File(name=fileToSave[u'id'], fileType=fileToSave[u'type'], parent=user+'/'+fileToSave[u'parent'], syntax=fileToSave[u'syntax'])
                        newFile.save()
                        f = open('resources/Projects/'+user+'/'+fileToSave[u'parent']+'/'+fileToSave[u'id'],'w',0664);
                        f.close()
                    return True
                else:
                    rawFile[0].text = fileToSave[u'text']
                    rawFile[0].syntax = fileToSave[u'syntax']
                    rawFile[0].save()
                    f = open('resources/Projects/'+user+'/'+fileToSave[u'parent']+'/'+fileToSave[u'id'],'w');
                    length = len(fileToSave[u'text'])
                    i = 0
                    while (i+64<length-1):
                        f.write(fileToSave[u'text'][i:i+64])
                        i = i+64
                    f.write(fileToSave[u'text'][i:i+64])
                    f.close()
                    return True
            else:
                #is a project
                rawFile = File.objects.filter(parent=user).filter(name=fileToSave[u'id'])
                if len(rawFile)==0: #create new project
                    newFile = File(name=fileToSave[u'id'], fileType=fileToSave[u'type'], parent=user)
                    newFile.save()
                    if not os.path.isdir('resources/Projects/'+user):
                        os.mkdir('resources/Projects/'+user)
                    os.mkdir('resources/Projects/'+user+'/'+fileToSave[u'id'],0775)
                    imagesFolder = File(name=u'images', fileType=u'dir', parent=user+'/'+fileToSave[u'id'])
                    imagesFolder.save()
                    os.mkdir('resources/Projects/'+user+'/'+fileToSave[u'id']+'/images',0775)
                    versionFolder = File(name=u'v1.0', fileType=u'dir', parent=user+'/'+fileToSave[u'id'])
                    versionFolder.save()
                    os.mkdir('resources/Projects/'+user+'/'+fileToSave[u'id']+'/v1.0',0775)
                    templateFile = File(name=u'template.xml', fileType=u'template', parent=user+'/'+fileToSave[u'id']+'/v1.0', syntax=u'xml')
                    templateFile.save()
                    tFile = open('resources/Projects/'+user+'/'+fileToSave[u'id']+'/v1.0/template.xml','w');
                    tFile.close()
                    indexFile = File(name=u'index.html', fileType=u'code', parent=user+'/'+fileToSave[u'id']+'/v1.0', syntax=u'html')
                    indexFile.save()
                    iFile = open('resources/Projects/'+user+'/'+fileToSave[u'id']+'/v1.0/index.html','w');
                    iFile.close()
                    return True
                else: # error
                    return False
        except:
            return False
