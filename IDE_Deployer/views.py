from django.template import Context, loader
from django.http import HttpResponse, HttpRequest, HttpResponseBadRequest
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required


def do_login(request):
    if request.method == 'GET':
        if not request.user.is_authenticated():
            return render_to_response("login.html",{'mediaRoot': '/resources/', 'errorMsg':''})
        else:
            return render_to_response("EditDeploy.html",{'mediaRoot': '/resources/', 'username': request.user.username})
    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return render_to_response("EditDeploy.html",{'mediaRoot': '/resources/', 'username': user.username})
            else:
                return render_to_response("login.html",{'mediaRoot': '/resources/', 'errorMsg':'Please enter a correct username and password. Note that both fields are case-sensitive.'})
        else:
            return render_to_response("login.html",{'mediaRoot': '/resources/', 'errorMsg':'Please enter a correct username and password. Note that both fields are case-sensitive.'})
    else:
        response = HttpResponseBadRequest()
        response.write("This URI is only available for GET or POST requests.")

@login_required
def do_logout(request):
    if request.method == 'GET':
        logout(request)
        return render_to_response("login.html",{'mediaRoot': '/resources/', 'errorMsg':''})
    else:
        response = HttpResponseBadRequest()
        response.write("This URI is only available for GET requests.")

